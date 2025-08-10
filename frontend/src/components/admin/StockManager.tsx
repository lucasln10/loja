import React, { useEffect, useState } from 'react';

interface ProductRow {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description?: string;
  detailedDescription?: string;
  status: boolean;
  quantity: number;
  reservation: number; // from storage
  imageUrl?: string;
  imageUrls?: string[];
}

interface Category { id: number; name: string; }

interface StockManagerProps { authToken: string; }

const API_BASE_URL = 'http://localhost:8080/api';

const StockManager: React.FC<StockManagerProps> = ({ authToken }) => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Partial<ProductRow>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const headersAuthJson = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  const load = async () => {
    setLoading(true);
    try {
      const [productsRes, storageRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/storage`, { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch(`${API_BASE_URL}/categories`),
      ]);
      const products = productsRes.ok ? await productsRes.json() : [];
      const storage = storageRes.ok ? await storageRes.json() : [];
      const cats = categoriesRes.ok ? await categoriesRes.json() : [];

      const storageByProduct: Record<number, { quantity: number; reservation: number }> = {};
      storage.forEach((s: any) => { if (s.product_id) storageByProduct[s.product_id] = { quantity: s.quantity, reservation: s.reservation } });

      const merged: ProductRow[] = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        categoryId: p.categoryId,
        description: p.description,
        detailedDescription: p.detailedDescription,
        status: !!p.status,
        quantity: storageByProduct[p.id]?.quantity ?? p.quantity ?? 0,
        reservation: storageByProduct[p.id]?.reservation ?? 0,
        imageUrl: p.imageUrl,
        imageUrls: p.imageUrls,
      }));

      setRows(merged);
      setCategories(cats);
    } catch (e) {
      console.error('Erro ao carregar dados de estoque', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setDraft({ name: '', price: 0, categoryId: categories[0]?.id ?? 0, description: '', detailedDescription: '', status: true, quantity: 0, reservation: 0 });
  setImageFiles([]);
  setImagePreviews([]);
  };

  const startEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setCreating(false);
    setDraft({ ...row });
    // carregar previews existentes (sem marcar para upload)
    const previews: string[] = [];
    if (row.imageUrls && row.imageUrls.length > 0) {
      row.imageUrls.forEach(u => previews.push(`http://localhost:8080${u}`));
    } else if (row.imageUrl) {
      previews.push(`http://localhost:8080${row.imageUrl}`);
    }
    setImagePreviews(previews);
    setImageFiles([]);
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setDraft({});
  setImageFiles([]);
  setImagePreviews([]);
  };

  const handleChange = (field: keyof ProductRow, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const saveCreate = async () => {
    try {
      const body = {
        name: draft.name,
        price: draft.price,
        categoryId: draft.categoryId,
        description: draft.description || '',
        detailedDescription: draft.detailedDescription || '',
        quantity: draft.quantity ?? 0,
        status: draft.status ?? true,
      };
      const res = await fetch(`${API_BASE_URL}/products`, { method: 'POST', headers: headersAuthJson, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Falha ao criar produto');
      const created = await res.json();
      // Atualizar reserva se necessário
      if ((draft.reservation ?? 0) > 0) {
        await fetch(`${API_BASE_URL}/storage/product/${created.id}`, { method: 'PUT', headers: headersAuthJson, body: JSON.stringify({ reservation: draft.reservation }) });
      }
      // Upload de imagens selecionadas
      if (imageFiles.length > 0) {
        const fd = new FormData();
        imageFiles.forEach(f => fd.append('files', f));
        await fetch(`${API_BASE_URL}/products/images/upload-multiple/${created.id}`, { method: 'POST', headers: { Authorization: `Bearer ${authToken}` }, body: fd });
      }
      await load();
      cancel();
      alert('Produto criado com sucesso');
    } catch (e) {
      alert('Erro ao criar produto');
      console.error(e);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const body = {
        id: editingId,
        name: draft.name,
        price: draft.price,
        categoryId: draft.categoryId,
        description: draft.description || '',
        detailedDescription: draft.detailedDescription || '',
        quantity: draft.quantity ?? 0,
        status: draft.status ?? true,
      };
      const res = await fetch(`${API_BASE_URL}/products/${editingId}`, { method: 'PUT', headers: headersAuthJson, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Falha ao salvar produto');

      // Atualizar reserva e manter sincronismo (opcional reenviar quantity junto)
      await fetch(`${API_BASE_URL}/storage/product/${editingId}`, { method: 'PUT', headers: headersAuthJson, body: JSON.stringify({ quantity: draft.quantity ?? 0, reservation: draft.reservation ?? 0 }) });

      // Upload de novas imagens, se houver
      if (imageFiles.length > 0) {
        const fd = new FormData();
        imageFiles.forEach(f => fd.append('files', f));
        await fetch(`${API_BASE_URL}/products/images/upload-multiple/${editingId}`, { method: 'POST', headers: { Authorization: `Bearer ${authToken}` }, body: fd });
      }

      await load();
      cancel();
      alert('Produto atualizado com sucesso');
    } catch (e) {
      alert('Erro ao salvar alterações');
      console.error(e);
    }
  };

  const toggleStatus = async (row: ProductRow) => {
    try {
      const path = row.status ? 'disable' : 'enable';
      const res = await fetch(`${API_BASE_URL}/products/${row.id}/${path}`, { method: 'PUT', headers: { Authorization: `Bearer ${authToken}` } });
      if (!res.ok) throw new Error('Falha na alternância de status');
      await load();
    } catch (e) {
      alert('Erro ao alternar status');
      console.error(e);
    }
  };

  const remove = async (row: ProductRow) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto? (Precisa estar inativo)')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${row.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${authToken}` } });
      if (!res.ok) throw new Error('Falha ao excluir produto');
      await load();
      alert('Produto excluído');
    } catch (e) {
      alert('Erro ao excluir (certifique-se que o produto esteja inativo)');
      console.error(e);
    }
  };

  const onImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setImageFiles(prev => [...prev, ...list]);
    list.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="stock-manager">
      <div className="stock-header">
        <h2>Estoque e Produtos</h2>
        <button className="btn-primary" onClick={startCreate}>+ Novo Produto</button>
      </div>

  {(creating || editingId) && (
        <div className="stock-editor">
          <div className="form-grid">
            <label>
              Nome
              <input value={draft.name || ''} onChange={e => handleChange('name', e.target.value)} />
            </label>
            <label>
              Preço
              <input type="number" min={0} step="0.01" value={draft.price ?? 0} onChange={e => handleChange('price', parseFloat(e.target.value || '0'))} />
            </label>
            <label>
              Categoria
              <select value={draft.categoryId ?? 0} onChange={e => handleChange('categoryId', parseInt(e.target.value, 10))}>
                <option value={0}>Selecione</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>
              Status
              <select value={(draft.status ?? true) ? '1' : '0'} onChange={e => handleChange('status', e.target.value === '1')}>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
            </label>
            <label className="span-2">
              Descrição
              <textarea value={draft.description || ''} onChange={e => handleChange('description', e.target.value)} rows={2} />
            </label>
            <label className="span-2">
              Descrição detalhada
              <textarea value={draft.detailedDescription || ''} onChange={e => handleChange('detailedDescription', e.target.value)} rows={3} />
            </label>
            <label>
              Quantidade
              <input type="number" min={0} value={draft.quantity ?? 0} onChange={e => handleChange('quantity', parseInt(e.target.value || '0', 10))} />
            </label>
            <label>
              Reserva
              <input type="number" min={0} value={draft.reservation ?? 0} onChange={e => handleChange('reservation', parseInt(e.target.value || '0', 10))} />
            </label>
            <div className="span-2">
              <div className="images-field">
                <div className="images-header">
                  <span>Imagens do produto</span>
                  <input id="stock-image-input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onImageInputChange} />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="images-grid small">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="img-prev">
                        <img src={src} alt={`preview-${idx}`} />
                        <button type="button" onClick={() => {
                          setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                          setImageFiles(prev => prev.filter((_, i) => i !== idx));
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="editor-actions">
            {creating ? (
              <button className="btn-primary" onClick={saveCreate}>Salvar</button>
            ) : (
              <button className="btn-primary" onClick={saveEdit}>Salvar</button>
            )}
            <button className="btn-secondary" onClick={cancel}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Qtd</th>
                <th>Reserva</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{categories.find(c => c.id === r.categoryId)?.name || '-'}</td>
                  <td>R$ {Number(r.price).toFixed(2)}</td>
                  <td>{r.quantity}</td>
                  <td>{r.reservation}</td>
                  <td>
                    <span className={`status ${r.status ? 'enabled' : 'disabled'}`}>{r.status ? 'Ativo' : 'Inativo'}</span>
                  </td>
                  <td className="actions">
                    <button className="btn-link" onClick={() => startEdit(r)}>Editar</button>
                    <button className="btn-link" onClick={() => toggleStatus(r)}>{r.status ? 'Desativar' : 'Ativar'}</button>
                    <button className="btn-link danger" onClick={() => remove(r)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockManager;
