import React, { useState, useEffect } from 'react';
import './ProductManager.css';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  imageUrl?: string;
}

interface ProductManagerProps {
  authToken: string;
}

const ProductManager: React.FC<ProductManagerProps> = ({ authToken }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: 0,
    imageUrl: ''
  });

  // Carregar produtos e categorias
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'categoryId' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploadingImage(true);
    const formDataImage = new FormData();
    formDataImage.append('file', imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/products/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formDataImage
      });

      if (response.ok) {
        const imageUrl = await response.text();
        return imageUrl;
      } else {
        throw new Error('Erro ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Fazer upload da imagem se uma nova foi selecionada
      if (imageFile) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const productData = {
        ...formData,
        imageUrl
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

  const handleEdit = (product: Product) => {
    setFormData(product);
    setSelectedProduct(product);
    setIsEditing(true);
    setImagePreview(product.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : null);
    setImageFile(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
          headers: headers
        });

        if (response.ok) {
          await loadProducts();
          alert('Produto excluído com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: 0,
      imageUrl: ''
    });
    setIsEditing(false);
    setSelectedProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setIsUploadingImage(false);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  return (
    <div className="product-manager">
      <div className="product-manager-header">
        <h2>Gerenciar Produtos</h2>
      </div>

      <div className="product-manager-content">
        {/* Formulário */}
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
                <label>Categoria *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value={0}>Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
              />
            </div>

            <div className="form-group">
              <label>Imagem do Produto</label>
              <div 
                className={`image-upload-zone ${imagePreview ? 'has-image' : ''}`}
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
                  const files = Array.from(e.dataTransfer.files);
                  const file = files[0];
                  if (file && file.type.startsWith('image/')) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImagePreview(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                onClick={() => document.getElementById('image-input')?.click()}
              >
                <input
                  id="image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview-img" />
                    <div className="image-overlay">
                      {isUploadingImage ? (
                        <div className="upload-loading">
                          <div className="loading-spinner"></div>
                          <p>Enviando imagem...</p>
                        </div>
                      ) : (
                        <div className="image-actions">
                          <button
                            type="button"
                            className="btn-change-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('image-input')?.click();
                            }}
                          >
                            📷 Alterar
                          </button>
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setImageFile(null);
                              setFormData(prev => ({...prev, imageUrl: ''}));
                            }}
                          >
                            🗑️ Remover
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">
                      <p><strong>Clique para selecionar</strong> ou arraste uma imagem aqui</p>
                      <p className="upload-hint">JPG, PNG ou WEBP • Máx. 10MB</p>
                    </div>
                  </div>
                )}
                
                {imageFile && !isUploadingImage && (
                  <div className="file-selected-indicator">
                    <span>📎 {imageFile.name} - Clique em "Salvar" para enviar</span>
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

        {/* Lista de Produtos */}
        <div className="products-list-section">
          <h3>Produtos Cadastrados</h3>
          
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.imageUrl ? (
                    <img 
                      src={`${API_BASE_URL}${product.imageUrl}`} 
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
                  <p className="product-category">{getCategoryName(product.categoryId)}</p>
                  <p className="product-price">R$ {product.price.toFixed(2)}</p>
                  <p className="product-stock">Estoque: {product.quantity}</p>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                </div>
                
                <div className="product-actions">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id!)}
                    className="btn-delete"
                  >
                    Excluir
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
