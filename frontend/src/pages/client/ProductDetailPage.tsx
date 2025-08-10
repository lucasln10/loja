import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { IoBagHandleSharp, IoArrowBack, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import './ProductDetailPage.css';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../context/AuthContext';

interface ProductDetails extends Product {
  specifications?: { [key: string]: string };
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const { user, isAuthenticated } = useAuth();

  // Scroll para o topo quando o componente é montado ou o ID do produto muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
  const loadProductDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productId = parseInt(id);
        
        // Carregar produto e imagens em paralelo
        const [productData, images] = await Promise.all([
          productService.getProductById(productId),
          productService.getProductImages(productId)
        ]);

        console.log('🔍 Produto carregado:', productData);
        console.log('🖼️ Imagens carregadas:', images);

        // Buscar detalhes da categoria
        let categoryName = productData.category;
        
        if (productData.categoryId) {
          try {
            const categoryData = await categoryService.getCategoryById(productData.categoryId);
            categoryName = categoryData.name;
          } catch (error) {
            console.log('❌ Erro ao buscar categoria, usando categoria do produto como fallback');
          }
        }

        // Expandir produto com dados adicionais para demonstração
        const detailedProduct: ProductDetails = {
          ...productData,
          category: categoryName,
          detailedDescription: productData.detailedDescription || `
            Este é um produto de alta qualidade ${productData.name.toLowerCase()}, 
            perfeito para diversos usos. Fabricado com materiais premium, 
            garante durabilidade e qualidade superior.
            
            Características principais:
            • Material de alta qualidade
            • Durável e resistente
            • Fácil de usar
            • Ótimo custo-benefício
          `,
          specifications: {
            'Material': 'Silicone alimentício premium',
            'Temperatura': '-40°C a +230°C',
            'Peso': '150g',
            'Dimensões': '15 x 10 x 3 cm',
            'Cor': 'Variada',
            'Garantia': '12 meses',
            'Origem': 'Nacional'
          },
          rating: 4.8,
          reviewCount: 127,
          inStock: (productData.quantity || 0) > 0,
          tags: ['Silicone', 'Premium', 'Antiaderente', 'Profissional']
        };

        setProduct(detailedProduct);
        setProductImages(images);

        // Inicializa estado de favorito
        try {
          if (isAuthenticated) {
            // Preferir favoriteProductIds do usuário, se houver no contexto; caso contrário buscar na API
            if (user?.favoriteProductIds && user.favoriteProductIds.length > 0) {
              setIsWishlisted(user.favoriteProductIds.includes(productId));
            } else {
              const favs = await favoriteService.getFavorites();
              setIsWishlisted(favs.has(productId));
            }
          } else {
            setIsWishlisted(false);
          }
        } catch (e) {
          console.warn('Não foi possível carregar favoritos do usuário:', e);
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      // Feedback visual ou notificação
      alert(`${quantity} ${product.name} adicionado(s) ao carrinho!`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/carrinho');
  };

  const toggleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      alert('Faça login para favoritar produtos.');
      navigate('/login');
      return;
    }
    const next = !isWishlisted;
    setIsWishlisted(next); // otimista
    try {
      if (next) {
        await favoriteService.addFavorite(product.id);
      } else {
        await favoriteService.removeFavorite(product.id);
      }
    } catch (e) {
      // reverte em caso de erro
      setIsWishlisted(!next);
      alert('Não foi possível atualizar o favorito.');
      console.error(e);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <h2>Produto não encontrado</h2>
          <p>O produto que você está procurando não existe ou foi removido.</p>
          <button className="back-btn" onClick={() => navigate('/produtos')}>
            <IoArrowBack /> Voltar aos Produtos
          </button>
        </div>
      </div>
    );
  }

  // Se não há imagens carregadas, usar imagem padrão
  const imagesToDisplay = productImages.length > 0 ? productImages : [product.image || '/images/logo.webp'];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/produtos')}>Produtos</button>
          <span>/</span>
          <button onClick={() => navigate(`/produtos?categoria=${product.categoryId}`)}>
            {product.category}
          </button>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Conteúdo Principal */}
        <div className="product-content">
          {/* Galeria de Imagens */}
          <div className="product-gallery">
            <div className="main-image-container">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="main-swiper"
              >
                {imagesToDisplay.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="main-product-image"
                      onError={(e) => {
                        e.currentTarget.src = '/images/logo.webp';
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
               {/* Miniaturas */}
            {imagesToDisplay.length > 1 && (
              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={10}
                className="thumbs-swiper"
              >
                {imagesToDisplay.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`Miniatura ${index + 1}`}
                      className="thumb-image"
                      onError={(e) => {
                        e.currentTarget.src = '/images/logo.webp';
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            </div>
            {/* Informações de Entrega */}
            <div className="shipping-info">
              <h4>Informações de Entrega</h4>
              <div className="shipping-options">
                <div className="shipping-option">
                  <span className="shipping-type">📦 Frete Grátis</span>
                  <span className="shipping-time">5-7 dias úteis</span>
                </div>
                <div className="shipping-option">
                  <span className="shipping-type">🚚 Entrega Expressa</span>
                  <span className="shipping-time">1-2 dias úteis - R$ 15,00</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações do Produto */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <button 
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                {isWishlisted ? <IoHeart /> : <IoHeartOutline />}
              </button>
            </div>

            <div className="product-meta">
              {/* <div className="rating-container">
                <div className="stars">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="rating-text">
                  {product.rating?.toFixed(1)} ({product.reviewCount} avaliações)
                </span>
              </div> */}
              
              <div className="category-tag">
                <span>Categoria: {product.category}</span>
              </div>
            </div>

            <div className="price-container">
              <div className="current-price">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>
              <div className="price-info">
                <span>à vista no PIX com 5% de desconto</span>
              </div>
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="product-tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {/* Controles de Compra */}
            <div className="purchase-controls">
              <div className="quantity-selector">
                <label>Quantidade:</label>
                <div className="quantity-input">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.quantity || 999}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min((product.quantity || 999), quantity + 1))}
                    disabled={quantity >= (product.quantity || 999)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <IoBagHandleSharp />
                  Adicionar ao Carrinho
                </button>
                
                <button 
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Comprar Agora
                </button>
              </div>

              <div className="stock-status">
                {product.inStock ? (
                  <span className="in-stock">✅ Em estoque ({product.quantity} unidades)</span>
                ) : (
                  <span className="out-of-stock">❌ Produto esgotado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Detalhes */}
        <div className="product-details-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descrição
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Especificações
            </button>
            {/* <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Avaliações ({product.reviewCount})
            </button> */}
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-content">
                <h3>Descrição Detalhada</h3>
                <div className="description-content">
                  {product.detailedDescription?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-content">
                <h3>Especificações Técnicas</h3>
                <div className="specifications-grid">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <dt className="spec-label">{key}:</dt>
                      <dd className="spec-value">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content">
                {/* <h3>Avaliações dos Clientes</h3>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <div className="rating-number">{product.rating?.toFixed(1)}</div>
                    <div className="stars-large">
                      {renderStars(product.rating || 0)}
                    </div>
                    <div className="review-count">{product.reviewCount} avaliações</div>
                  </div>
                </div> */}
                
                {/* Aqui você pode adicionar as avaliações reais quando implementar */}
                {/* <div className="reviews-placeholder">
                  <p>Sistema de avaliações será implementado em breve.</p>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
