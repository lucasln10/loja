import React, { useState, useEffect } from 'react';
import { CategoryDTO, categoryService } from '../../services/categoryService';
import './CategoryManager.css';

interface CategoryManagerProps {
  authToken: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ authToken }) => {
  console.log('CategoryManager renderizado com authToken:', authToken); // Adicionando log de depuração
  
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [headerCategories, setHeaderCategories] = useState<CategoryDTO[]>([]); // Nova variável para categorias do header
  const [rootCategories, setRootCategories] = useState<CategoryDTO[]>([]);
  const [subcategories, setSubcategories] = useState<Record<number, CategoryDTO[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [draggedCategory, setDraggedCategory] = useState<CategoryDTO | null>(null); // Para drag and drop

  const [formData, setFormData] = useState<CategoryDTO>({
    name: '',
    parentId: undefined,
    showInHeader: false,
    headerOrder: 0
  });

  // Carregar categorias
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const allCategories = await categoryService.getAllCategories();
      setCategories(allCategories || []); // Garantir que allCategories não seja undefined
      
      // Separar categorias raiz
      const rootCats = (allCategories || []).filter(cat => !cat.parentId);
      setRootCategories(rootCats);
      
      // Carregar subcategorias para cada categoria raiz
      const subcats: Record<number, CategoryDTO[]> = {};
      for (const cat of rootCats) {
        try {
          const subs = await categoryService.getSubcategories(cat.id!);
          subcats[cat.id!] = subs || []; // Garantir que subs não seja undefined
        } catch (error) {
          console.error(`Erro ao carregar subcategorias para categoria ${cat.id}:`, error);
        }
      }
      setSubcategories(subcats);
      
      // Carregar categorias do header ordenadas
      loadHeaderCategories();
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeaderCategories = async () => {
    try {
      const headerCats = await categoryService.getHeaderCategories();
      // Ordenar por headerOrder
      const sortedHeaderCats = (headerCats || []).sort((a, b) => 
        (a.headerOrder || 0) - (b.headerOrder || 0)
      );
      setHeaderCategories(sortedHeaderCats);
    } catch (error) {
      console.error('Erro ao carregar categorias do header:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'parentId' && value === '' ? undefined : 
              name === 'parentId' ? parseInt(value) || undefined : 
              name === 'headerOrder' ? parseInt(value) || 0 :
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing && selectedCategory?.id) {
        await categoryService.updateCategory(selectedCategory.id, formData, authToken);
        alert('Categoria atualizada com sucesso!');
      } else {
        await categoryService.createCategory(formData, authToken);
        alert('Categoria criada com sucesso!');
      }
      
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: CategoryDTO) => {
    setFormData({
      name: category.name || '',
      parentId: category.parentId,
      showInHeader: category.showInHeader || false,
      headerOrder: category.headerOrder || 0
    });
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(id, authToken);
      alert('Categoria excluída com sucesso!');
      await loadCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria');
    }
  };

  const handleToggleStatus = async (category: CategoryDTO) => {
    try {
      if (category.status) {
        // Currently active, so deactivate
        await fetch(`http://localhost:8080/api/categories/${category.id}/disable`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
        alert('Categoria desativada com sucesso!');
      } else {
        // Currently inactive, so activate
        await fetch(`http://localhost:8080/api/categories/${category.id}/enable`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
        alert('Categoria ativada com sucesso!');
      }
      await loadCategories();
    } catch (error) {
      console.error('Erro ao alternar status da categoria:', error);
      alert('Erro ao alternar status da categoria');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      parentId: undefined,
      showInHeader: false,
      headerOrder: 0
    });
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const loadSubcategories = async (parentId: number) => {
    try {
      const subs = await categoryService.getSubcategories(parentId);
      setSubcategories(prev => ({
        ...prev,
        [parentId]: subs
      }));
    } catch (error) {
      console.error(`Erro ao carregar subcategorias para categoria ${parentId}:`, error);
    }
  };

  // Funções para drag and drop
  const handleDragStart = (e: React.DragEvent, category: CategoryDTO) => {
    setDraggedCategory(category);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetCategory: CategoryDTO) => {
    e.preventDefault();
    
    if (!draggedCategory || draggedCategory.id === targetCategory.id) {
      return;
    }
    
    // Criar nova ordem baseada na posição do drop
    const newOrder = [...headerCategories];
    const draggedIndex = newOrder.findIndex(c => c.id === draggedCategory.id);
    const targetIndex = newOrder.findIndex(c => c.id === targetCategory.id);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remover a categoria arrastada da posição atual
      const [removed] = newOrder.splice(draggedIndex, 1);
      // Inserir na nova posição
      newOrder.splice(targetIndex, 0, removed);
      
      // Atualizar o estado
      setHeaderCategories(newOrder);
      
      // Enviar nova ordem para o backend
      try {
        const categoryIds = newOrder.map(c => c.id!);
        await categoryService.updateHeaderOrder(categoryIds, authToken);
        alert('Ordem das categorias atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar ordem das categorias:', error);
        alert('Erro ao atualizar ordem das categorias');
        // Reverter a mudança se falhar
        loadHeaderCategories();
      }
    }
    
    setDraggedCategory(null);
  };

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h2>Gerenciar Categorias</h2>
      </div>

      <div className="category-manager-content">
        {/* Formulário de categoria */}
        <div className="category-form-section">
          <h3>{isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
          
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label>Nome da Categoria *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria Pai</label>
              <select
                name="parentId"
                value={formData.parentId || ''}
                onChange={handleInputChange}
              >
                <option value="">Nenhuma (categoria raiz)</option>
                {categories
                  .filter(cat => !selectedCategory || cat.id !== selectedCategory.id)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ordem no Header</label>
              <input
                type="number"
                name="headerOrder"
                value={formData.headerOrder || 0}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="showInHeader"
                  checked={formData.showInHeader || false}
                  onChange={handleInputChange}
                />
                Exibir no header do site
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-cancel"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </button>
            </div>
          </form>
        </div>

        {/* Seção de ordenação de categorias do header */}
        <div className="header-order-section">
          <h3>Ordenar Categorias do Header</h3>
          <p className="section-description">
            Arraste e solte as categorias abaixo para definir a ordem em que aparecem no menu do site.
            Apenas categorias marcadas com "Header" são exibidas.
          </p>
          
          {headerCategories.length > 0 ? (
            <div className="header-categories-list">
              {headerCategories.map((category) => (
                <div
                  key={category.id}
                  className={`header-category-item ${category.showInHeader ? 'show-in-header' : ''}`}
                  draggable={category.showInHeader}
                  onDragStart={(e) => category.showInHeader && handleDragStart(e, category)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => category.showInHeader && handleDrop(e, category)}
                >
                  <div className="category-drag-handle">
                    {category.showInHeader ? '☰' : '⊘'}
                  </div>
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    {category.showInHeader && (
                      <span className="category-badge header-badge">Header</span>
                    )}
                    {category.showInHeader && (
                      <span className="category-order">Ordem: {category.headerOrder || 0}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-header-categories">
              Nenhuma categoria configurada para aparecer no header.
              Edite uma categoria e marque "Exibir no header do site".
            </div>
          )}
        </div>

        {/* Lista de categorias */}
        <div className="categories-list-section">
          <h3>Categorias Existentes</h3>
          
          {isLoading ? (
            <div className="loading">Carregando categorias...</div>
          ) : (
            <div className="categories-tree">
              {rootCategories.map(category => (
                <div key={category.id} className="category-item">
                  <div className="category-row">
                    <div className="category-info">
                      <span className="category-name">{category.name}</span>
                      {category.showInHeader && (
                        <span className="category-badge header-badge">Header</span>
                      )}
                      {category.showInHeader && (
                        <span className="category-order">Ordem: {category.headerOrder || 0}</span>
                      )}
                    </div>
                    <div className="category-actions">
                      <button 
                        className="btn-toggle"
                        onClick={() => toggleCategoryExpansion(category.id!)}
                      >
                        {expandedCategories.has(category.id!) ? '▼' : '▶'}
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(category)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(category.id!)}
                      >
                        Excluir
                      </button>
                      <button 
                        className={`btn-status ${category.status ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(category)}
                      >
                        {category.status ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Subcategorias */}
                  {expandedCategories.has(category.id!) && (
                    <div className="subcategories">
                      {subcategories[category.id!]?.map(subcategory => (
                        <div key={subcategory.id} className="subcategory-item">
                          <div className="subcategory-row">
                            <div className="subcategory-info">
                              <span className="subcategory-name">↳ {subcategory.name}</span>
                              {subcategory.showInHeader && (
                                <span className="category-badge header-badge">Header</span>
                              )}
                              {subcategory.showInHeader && (
                                <span className="category-order">Ordem: {subcategory.headerOrder || 0}</span>
                              )}
                            </div>
                            <div className="subcategory-actions">
                              <button 
                                className="btn-edit"
                                onClick={() => handleEdit(subcategory)}
                              >
                                Editar
                              </button>
                              <button 
                                className="btn-delete"
                                onClick={() => handleDelete(subcategory.id!)}
                              >
                                Excluir
                              </button>
                              <button 
                                className={`btn-status ${subcategory.status ? 'active' : 'inactive'}`}
                                onClick={() => handleToggleStatus(subcategory)}
                              >
                                {subcategory.status ? 'Ativo' : 'Inativo'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {subcategories[category.id!] && subcategories[category.id!]!.length === 0 && (
                        <div className="no-subcategories">Nenhuma subcategoria</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {rootCategories.length === 0 && (
                <div className="no-categories">Nenhuma categoria cadastrada</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;