import React, { useState, useEffect } from 'react';
import { CarouselItem, Product } from '../../types';
import { carouselService } from '../../services/carouselService';
import { productService } from '../../services/productService';
import './CarouselManager.css';

const CarouselManager: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'PRODUCT' | 'CUSTOM'>('PRODUCT');
  
  // Estados para formulário
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || '';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [carouselData, productsData] = await Promise.all([
        carouselService.getAllCarouselItems(getAuthToken()),
        productService.getAllProducts()
      ]);
      setCarouselItems(carouselData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      setSelectedImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleAddItem = async () => {
    try {
      if (selectedType === 'PRODUCT') {
        if (!selectedProductId) {
          alert('Selecione um produto');
          return;
        }
        await carouselService.addProductToCarousel(selectedProductId, displayOrder, getAuthToken());
      } else {
        if (!customTitle || !customDescription || !selectedImage) {
          alert('Preencha todos os campos obrigatórios e selecione uma imagem');
          return;
        }
        await carouselService.addCustomToCarousel(
          selectedImage,
          customTitle,
          customDescription,
          customLinkUrl,
          displayOrder,
          getAuthToken()
        );
      }
      
      setShowAddForm(false);
      resetForm();
      loadData();
      alert('Item adicionado ao carrossel com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item ao carrossel');
    }
  };

  const resetForm = () => {
    setSelectedProductId(null);
    setCustomTitle('');
    setCustomDescription('');
    setCustomLinkUrl('');
    setDisplayOrder(1);
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedType('PRODUCT');
  };

  const handleRemoveItem = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este item do carrossel?')) {
      try {
        await carouselService.removeCarouselItem(id, getAuthToken());
        loadData();
        alert('Item removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item');
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await carouselService.toggleCarouselItem(id, getAuthToken());
      loadData();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do item');
    }
  };

  if (loading) {
    return <div className="loading">Carregando carrossel...</div>;
  }

  return (
    <div className="carousel-manager">
      <div className="carousel-manager-header">
        <h2>Gerenciar Carrossel</h2>
        <button 
          className="add-item-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Adicionar Item
        </button>
      </div>

      {/* Formulário para adicionar item */}
      {showAddForm && (
        <div className="add-form-overlay">
          <div className="add-form">
            <h3>Adicionar Item ao Carrossel</h3>
            
            <div className="form-group">
              <label>Tipo de Item:</label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value as 'PRODUCT' | 'CUSTOM')}
              >
                <option value="PRODUCT">Produto Existente</option>
                <option value="CUSTOM">Imagem Personalizada</option>
              </select>
            </div>

            {selectedType === 'PRODUCT' ? (
              <div className="form-group">
                <label>Selecionar Produto:</label>
                <select 
                  value={selectedProductId || ''} 
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                >
                  <option value="">Escolha um produto...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Título: *</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Ex: Promoção Especial, Novidades..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição: *</label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Descrição do que acontece ao clicar..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Imagem do Carrossel: *</label>
                  <div className="image-upload-container">
                    {!selectedImage ? (
                      <div className="upload-area">
                        <input
                          type="file"
                          id="carousel-image"
                          accept="image/*"
                          onChange={handleImageSelect}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="carousel-image" className="upload-btn">
                          📁 Selecionar Imagem
                        </label>
                        <p className="upload-hint">
                          Formatos aceitos: JPG, PNG, WEBP (máx. 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="image-preview-container">
                        <img 
                          src={imagePreview!} 
                          alt="Preview" 
                          className="image-preview"
                        />
                        <button 
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                        >
                          ❌ Remover
                        </button>
                        <p className="selected-file-name">
                          {selectedImage.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Link de Destino (opcional):</label>
                  <input
                    type="url"
                    value={customLinkUrl}
                    onChange={(e) => setCustomLinkUrl(e.target.value)}
                    placeholder="https://exemplo.com (deixe vazio para ir para /produtos)"
                  />
                  <small className="form-hint">
                    Se contiver "promoção" no título, vai para /produtos?categoria=promocao automaticamente
                  </small>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Ordem de Exibição:</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
              <button 
                className="save-btn"
                onClick={handleAddItem}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de itens do carrossel */}
      <div className="carousel-items-list">
        {carouselItems.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum item no carrossel. Adicione o primeiro!</p>
          </div>
        ) : (
          carouselItems.map(item => (
            <div key={item.id} className={`carousel-item-card ${!item.active ? 'inactive' : ''}`}>
              <div className="item-image">
                <img 
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`} 
                  alt={item.title} 
                />
              </div>
              
              <div className="item-details">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <div className="item-meta">
                  <span className="item-type">
                    {item.carouselType === 'PRODUCT' ? 'Produto' : 'Personalizado'}
                  </span>
                  <span className="item-order">Ordem: {item.displayOrder}</span>
                </div>
              </div>

              <div className="item-actions">
                <button
                  className={`toggle-btn ${item.active ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleActive(item.id)}
                >
                  {item.active ? 'Ativo' : 'Inativo'}
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CarouselManager;
