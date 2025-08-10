import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, CarouselItem } from '../../types';
import { productService } from '../../services/productService';
import { carouselService } from '../../services/carouselService';
import { FaTruckFast } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";
import { TbBrandCake } from "react-icons/tb";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import ProductCard from '../../components/home/ProductCard/ProductCard';
import './HomePage.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para produtos estáticos como fallback
  const getStaticProducts = (): Product[] => [
    {
      id: 1,
      name: 'Molde Coração Romântico',
      price: 45.90,
      image: '/images/logo.webp', // ✅ Usar a logo real
      description: 'Perfeito para bolos de aniversário e celebrações românticas',
      category: 'Românticos',
      quantity: 10
    },
    {
      id: 2,
      name: 'Molde Estrela Mágica',
      price: 38.50,
      image: '/images/logo.webp', // ✅ Usar a logo real
      description: 'Formato de estrela para bolos especiais e festividades',
      category: 'Estrelas',
      quantity: 15
    },
    {
      id: 3,
      name: 'Molde Flor Delicada',
      price: 42.00,
      image: '/images/logo.webp', // ✅ Usar a logo real
      description: 'Design floral elegante para bolos sofisticados',
      category: 'Florais',
      quantity: 8
    },
    {
      id: 4,
      name: 'Molde Borboleta Encantada',
      price: 47.90,
      image: '/images/logo.webp', // ✅ Usar a logo real
      description: 'Formato de borboleta para decorações delicadas',
      category: 'Animais',
      quantity: 12
    },
    {
      id: 5,
      name: 'Molde Lua Crescente',
      price: 39.90,
      image: '/images/logo.webp', // ✅ Usar a logo real
      description: 'Design lunar para bolos temáticos noturnos',
      category: 'Celestiais',
      quantity: 6
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Iniciando carregamento de dados...');
        
        // Primeiro tenta carregar do backend
        try {
          const [carousel, featured] = await Promise.all([
            carouselService.getActiveCarouselItems(),
            productService.getFeaturedProducts()
          ]);
          
          console.log('Dados carregados do backend:', { carousel, featured });
          
          // Se conseguiu carregar carousel, usa do backend
          if (carousel.length > 0) {
            setCarouselItems(carousel);
          } else {
            // Usa produtos estáticos para carousel
            const staticProducts = getStaticProducts();
            const staticCarouselItems: CarouselItem[] = staticProducts.map((product, index) => ({
              id: product.id,
              title: product.name,
              description: product.description,
              imageUrl: product.image,
              carouselType: 'PRODUCT' as const,
              productId: product.id,
              product: product,
              active: true,
              displayOrder: index + 1
            }));
            setCarouselItems(staticCarouselItems);
          }

          // Se conseguiu carregar produtos em destaque, usa do backend
          if (featured.length > 0) {
            setFeaturedProducts(featured);
          } else {
            // Usa produtos estáticos
            const staticProducts = getStaticProducts();
            setFeaturedProducts(staticProducts.slice(0, 3));
          }
        } catch (backendError) {
          console.log('Backend não disponível, usando produtos estáticos:', backendError);
          
          // Usar produtos estáticos para tudo
          const staticProducts = getStaticProducts();
          const staticCarouselItems: CarouselItem[] = staticProducts.map((product, index) => ({
            id: product.id,
            title: product.name,
            description: product.description,
            imageUrl: product.image,
            carouselType: 'PRODUCT' as const,
            productId: product.id,
            product: product,
            active: true,
            displayOrder: index + 1
          }));
          setCarouselItems(staticCarouselItems);
          setFeaturedProducts(staticProducts.slice(0, 3));
        }
      } catch (err) {
        console.error('Erro geral:', err);
        // Fallback final para produtos estáticos
        const staticProducts = getStaticProducts();
        const staticCarouselItems: CarouselItem[] = staticProducts.map((product, index) => ({
          id: product.id,
          title: product.name,
          description: product.description,
          imageUrl: product.image,
          carouselType: 'PRODUCT' as const,
          productId: product.id,
          product: product,
          active: true,
          displayOrder: index + 1
        }));
        setCarouselItems(staticCarouselItems);
        setFeaturedProducts(staticProducts.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Adicionar este useEffect para debug
  useEffect(() => {
    console.log('Estado atual:', {
      isLoading,
      error,
      carouselItemsLength: carouselItems.length,
      featuredProductsLength: featuredProducts.length
    });
  }, [isLoading, error, carouselItems, featuredProducts]);

  // Adicione este useEffect após os existentes
  useEffect(() => {
    console.log('Itens do carrossel:', carouselItems);
    carouselItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        title: item.title,
        imageUrl: item.imageUrl
      });
    });
  }, [carouselItems]);

  // Função para lidar com cliques no carrossel
  const handleCarouselClick = (item: CarouselItem) => {
    if (item.carouselType === 'PRODUCT' && item.productId) {
      // Se for um produto, navega para a página de detalhes do produto
      navigate(`/produtos/${item.productId}`);
    } else if (item.carouselType === 'CUSTOM') {
      // Se for personalizado, verifica se tem uma categoria no título ou link
      if (item.linkUrl) {
        // Se tem um link personalizado, usa esse link
        window.open(item.linkUrl, '_blank');
      } else if (item.title.toLowerCase().includes('promoção') || item.title.toLowerCase().includes('promocao')) {
        // Se o título contém "promoção", vai para produtos com filtro de promoção
        navigate('/produtos?categoria=promocao');
      } else if (item.title.toLowerCase().includes('novidade')) {
        // Se o título contém "novidade", vai para produtos com filtro de novidades
        navigate('/produtos?categoria=novidades');
      } else if (item.title.toLowerCase().includes('liquidação') || item.title.toLowerCase().includes('liquidacao')) {
        // Se o título contém "liquidação", vai para produtos com filtro de liquidação
        navigate('/produtos?categoria=liquidacao');
      } else {
        // Caso padrão, vai para a página de produtos
        navigate('/produtos');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Carrossel de Produtos */}
      <section className="hero-carousel">
        <div className="carousel-container">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            slidesPerView={1}
            style={{ width: '100%', height: '100%' }}
          >
            {carouselItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div 
                  className="carousel-slide"
                  onClick={() => handleCarouselClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="carousel-image-container">
                    <img 
                      src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`} 
                      alt={item.title}
                      onError={(e) => {
                        console.error('Erro ao carregar imagem do carrossel:', item.imageUrl);
                        // Fallback para logo se a imagem não carregar
                        (e.target as HTMLImageElement).src = '/images/logo.webp';
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
      <section className="featured-products">
        <div className="container">
          <h2>Produtos em Destaque</h2>
          <p className="section-subtitle">Descubra nossos moldes mais populares</p>
          
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="view-all-container">
            <button className="view-all-btn" onClick={() => navigate('/produtos')}>
              Ver Todos os Produtos →
            </button>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="container">
          <h2>Por que escolher a Crys Leão?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon"><TbBrandCake /></div>
              <h3>Design Exclusivo</h3>
              <p>Moldes únicos criados especialmente para deixar seus bolos extraordinários</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><IoShieldCheckmark /></div>
              <h3>Qualidade Garantida</h3>
              <p>Materiais de primeira linha que garantem durabilidade e resultados perfeitos</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><FaTruckFast /></div>
              <h3>Entrega Rápida</h3>
              <p>Receba seus moldes rapidamente e com segurança em sua casa</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;