import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminProduct } from '../../types';
import './ProductManager.css';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface ProductManagerProps {
  authToken: string;
}

const ProductManager: React.FC<ProductManagerProps> = ({ authToken }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // Removido: não usado
  // const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreate, setShowCreate] = useState(false); // Permitir mostrar/ocultar criação
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const API_BASE_URL = 'http://localhost:8080/api';

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  const [formData, setFormData] = useState<AdminProduct>({
    name: '',
    description: '',
    detailedDescription: '',
    price: 0,
    quantity: 0,
    categoryId: 0,
    categoryIds: [], // Inicializando com array vazio
    imageUrl: '',
    imageUrls: []
  });

  // Carregar produtos e categorias
  useEffect(() => {
    const run = async () => {
      await loadProducts();
      await loadCategories();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: headers
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleToggleStatus = async (product: AdminProduct) => {
    try {
      const path = product.status ? 'disable' : 'enable';
      await fetch(`${API_BASE_URL}/products/${product.id}/${path}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      await loadProducts();
    } catch (e) {
      console.error('Erro ao alternar status do produto', e);
    }
  };

  // Vai para o estoque
  const goToEditStock = (productId: number) => {
    navigate(`/admin?tab=stock&productId=${productId}`);
  };

  // Vai para a página de detalhes do produto
  const goToProductDetails = (productId: number) => {
    navigate(`/produto/${productId}`);
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: headers
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Tratamento especial para seleção de múltiplas categorias
    if (name === 'categoryIds') {
      const selectElement = e.target as HTMLSelectElement;
      const selectedValues = Array.from(selectElement.selectedOptions).map(option => parseInt(option.value));
      setFormData(prev => ({
        ...prev,
        categoryIds: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'quantity' || name === 'categoryId' 
          ? parseFloat(value) || 0 
          : value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Função para lidar com a seleção de múltiplos arquivos
  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    setImageFiles(prev => [...prev, ...fileArray]);

    // Criar previews para os novos arquivos
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Função para upload de múltiplas imagens
  const uploadMultipleImages = async (productId: number): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setIsUploadingImage(true);
    const formDataImages = new FormData();
    imageFiles.forEach(file => {
      formDataImages.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/products/images/upload-multiple/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formDataImages
      });

      if (response.ok) {
        const imageUrls = await response.json();
        return imageUrls;
      } else {
        throw new Error('Erro ao fazer upload das imagens');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      return [];
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Preparar dados do produto com múltiplas categorias
      const productData = { 
        ...formData, 
        imageUrl: formData.imageUrls?.[0] || '', // Usar primeira imagem como principal para compatibilidade
        categoryIds: formData.categoryIds || [] // Garantir que sempre tenha um array
      };

      const url = isEditing 
        ? `${API_BASE_URL}/products/${formData.id}`
        : `${API_BASE_URL}/products`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: headers,
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        
        // Se há imagens para upload, fazer o upload após salvar o produto
        if (imageFiles.length > 0 && savedProduct.id) {
          await uploadMultipleImages(savedProduct.id);
        }

        await loadProducts();
        resetForm();
        alert(isEditing ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
      } else {
        throw new Error('Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar produto');
    } finally {
      setIsLoading(false);
    }
  };

  // Editar/Excluir removidos por solicitação: apenas alternar status permanece

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      detailedDescription: '',
      price: 0,
      quantity: 0,
      categoryId: 0,
      categoryIds: [], // Resetar para array vazio
      imageUrl: '',
      imageUrls: []
    });
    setIsEditing(false);
    setImageFiles([]);
    setImagePreviews([]);
    setIsUploadingImage(false);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const getCategoryNames = (categoryIds?: number[]) => {
    if (!categoryIds || categoryIds.length === 0) {
      return 'Nenhuma categoria';
    }
    
    const names = categoryIds
      .map(id => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : null;
      })
      .filter(name => name !== null) as string[];
    
    return names.length > 0 ? names.join(', ') : 'Categoria não encontrada';
  };

  return (
    <div className="product-manager">
      <div className="product-manager-header">
        <h2>Gerenciar Produtos</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? 'Cancelar' : 'Adicionar Novo Produto'}
        </button>
      </div>

      <div className="product-manager-content">
  {/* Formulário (opcional) */}
  {showCreate && (
  <div className="product-form-section">
          <h3>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
          
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nome do Produto *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categorias *</label>
                <div className="checkbox-group">
                  {categories.map(category => (
                    <label key={category.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="categoryIds"
                        value={category.id}
                        checked={formData.categoryIds?.includes(category.id) || false}
                        onChange={(e) => {
                          const categoryId = category.id;
                          if (e.target.checked) {
                            // Adicionar categoria
                            setFormData(prev => ({
                              ...prev,
                              categoryIds: [...(prev.categoryIds || []), categoryId]
                            }));
                          } else {
                            // Remover categoria
                            setFormData(prev => ({
                              ...prev,
                              categoryIds: (prev.categoryIds || []).filter(id => id !== categoryId)
                            }));
                          }
                        }}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
                <small>Selecione uma ou mais categorias</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantidade em Estoque *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Descrição curta do produto"
              />
            </div>

            <div className="form-group">
              <label>Descrição Detalhada</label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription || ''}
                onChange={handleInputChange}
                rows={6}
                placeholder="Descrição completa e detalhada do produto (aparecerá na página de detalhes)"
              />
            </div>

            <div className="form-group">
              <label>Imagens do Produto (múltiplas)</label>
              <div 
                className={`image-upload-zone ${imagePreviews.length > 0 ? 'has-image' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    handleFileSelect(files);
                  }
                }}
                onClick={() => document.getElementById('image-input')?.click()}
              >
                <input
                  id="image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                
                {imagePreviews.length > 0 ? (
                  <div className="images-preview-container">
                    <div className="images-grid">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={preview} alt={`Preview ${index + 1}`} className="image-preview-img" />
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreviews(prev => prev.filter((_, i) => i !== index));
                              setImageFiles(prev => prev.filter((_, i) => i !== index));
                            }}
                          >
                            ❌
                          </button>
                          {index === 0 && <span className="primary-badge">Principal</span>}
                        </div>
                      ))}
                    </div>
                    <div className="upload-actions">
                      <button
                        type="button"
                        className="btn-add-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('image-input')?.click();
                        }}
                      >
                        ➕ Adicionar mais
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">
                      <p><strong>Clique para selecionar</strong> ou arraste múltiplas imagens aqui</p>
                      <p className="upload-hint">JPG, PNG ou WEBP • Máx. 10MB cada • Múltiplas imagens permitidas</p>
                    </div>
                  </div>
                )}
                
                {imageFiles.length > 0 && !isUploadingImage && (
                  <div className="file-selected-indicator">
                    <span>📎 {imageFiles.length} imagem(ns) selecionada(s) - Clique em "Salvar" para enviar</span>
                  </div>
                )}

                {isUploadingImage && (
                  <div className="upload-loading">
                    <div className="loading-spinner"></div>
                    <p>Enviando imagens...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')} Produto
              </button>
              
              {isEditing && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
  </div>
  )}

        {/* Lista de Produtos */}
        <div className="products-list-section">
          <h3>Produtos Cadastrados</h3>
          
          <div className="products-grid">
            {products.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => product.id && goToProductDetails(product.id as number)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <div className="product-images-container">
                      <img 
                        src={`http://localhost:8080${product.imageUrls[0]}`} 
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                      {product.imageUrls.length > 1 && (
                        <div className="image-count-badge">
                          +{product.imageUrls.length - 1}
                        </div>
                      )}
                    </div>
                  ) : product.imageUrl ? (
                    <img 
                      src={`http://localhost:8080${product.imageUrl}`} 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                      }}
                    />
                  ) : (
                    <div className="no-image">Sem imagem</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-category">{getCategoryNames(product.categoryIds || (product.categoryId ? [product.categoryId] : []))}</p>
                  <p className="product-price">R$ {product.price.toFixed(2)}</p>
                  <p className="product-stock">Estoque: {product.quantity}</p>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                </div>
                
                <div className="product-actions">
                  <button
                    onClick={(e) => { e.stopPropagation(); if (product.id) goToEditStock(product.id as number); }}
                    className="btn-primary"
                  >
                    Editar Estoque
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(product); }}
                    className="btn-secondary"
                  >
                    {product.status ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="no-products">
              <p>Nenhum produto cadastrado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
