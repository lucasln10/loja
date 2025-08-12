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
        <div className="pdp-loading-container">
          <div className="pdp-loading-spinner"></div>
          <p>Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="pdp-error-container">
          <h2>Produto não encontrado</h2>
          <p>O produto que você está procurando não existe ou foi removido.</p>
          <button className="pdp-back-btn" onClick={() => navigate('/produtos')}>
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
      <div className="pdp-container">
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
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
        <div className="pdp-product-content">
          {/* Galeria de Imagens */}
          <div className="pdp-product-gallery">
            <div className="pdp-main-image-container">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="pdp-main-swiper"
              >
                {imagesToDisplay.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="pdp-main-product-image"
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
                className="pdp-thumbs-swiper"
              >
                {imagesToDisplay.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`Miniatura ${index + 1}`}
                      className="pdp-thumb-image"
                      onError={(e) => {
                        e.currentTarget.src = '/images/logo.webp';
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            {/* Informações de Entrega */}
            <div className="pdp-shipping-info">
              <h4>Informações de Entrega</h4>
              <div className="pdp-shipping-options">
                <div className="pdp-shipping-option">
                  <span className="pdp-shipping-type">📦 Frete Grátis</span>
                  <span className="pdp-shipping-time">5-7 dias úteis</span>
                </div>
                <div className="pdp-shipping-option">
                  <span className="pdp-shipping-type">🚚 Entrega Expressa</span>
                  <span className="pdp-shipping-time">1-2 dias úteis - R$ 15,00</span>
                </div>
              </div>
            </div>
            </div>
          </div>
          
          {/* Informações do Produto */}
          <div className="pdp-product-info">
            <div className="pdp-product-header">
              <h1 className="pdp-product-title">{product.name}</h1>
              <button 
                className={`pdp-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                {isWishlisted ? <IoHeart /> : <IoHeartOutline />}
              </button>
            </div>
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pdp-product-tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="pdp-tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="pdp-product-meta">
              {/* <div className="pdp-rating-container">
                <div className="pdp-stars">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="pdp-rating-text">
                  {product.rating?.toFixed(1)} ({product.reviewCount} avaliações)
                </span>
              </div> */}
              
              <div className="pdp-category-tag">
                <span>Categoria: {product.category}</span>
              </div>
            </div>

            <div className="pdp-price-container">
              <div className="pdp-current-price">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>
              <div className="pdp-price-info">
                <span>à vista no PIX com 5% de desconto</span>
              </div>
            </div>
            {/* Controles de Compra */}
            <div className="pdp-purchase-controls">
              <div className="pdp-quantity-selector">
                <label>Quantidade:</label>
                <div className="pdp-quantity-input">
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

              <div className="pdp-action-buttons">
                <button 
                  className="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <IoBagHandleSharp />
                  Adicionar ao Carrinho
                </button>
                
                <button 
                  className="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Detalhes */}
        <div className="pdp-product-details-tabs">
          <div className="pdp-tabs-header">
            <button 
              className={`pdp-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descrição
            </button>
            <button 
              className={`pdp-tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Especificações
            </button>
            {/* <button 
              className={`pdp-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Avaliações ({product.reviewCount})
            </button> */}
          </div>

          <div className="pdp-tabs-content">
            {activeTab === 'description' && (
              <div className="pdp-tab-content">
                <h3>Descrição Detalhada</h3>
                <div className="pdp-description-content">
                  {product.detailedDescription?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="pdp-tab-content">
                <h3>Especificações Técnicas</h3>
                <div className="pdp-specifications-grid">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="pdp-spec-item">
                      <dt className="pdp-spec-label">{key}:</dt>
                      <dd className="pdp-spec-value">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pdp-tab-content">
                {/* <h3>Avaliações dos Clientes</h3>
                <div className="pdp-reviews-summary">
                  <div className="pdp-average-rating">
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
