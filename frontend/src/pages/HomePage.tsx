import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicione esta importação
import { Product } from '../types';
import { productService } from '../services/productService';
import { FaTruckFast } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";
import { TbBrandCake } from "react-icons/tb";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import ProductCard from '../components/home/ProductCard/ProductCard';
import './HomePage.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Adicione esta linha
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [carouselProducts, setCarouselProducts] = useState<Product[]>([]);
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
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Iniciando carregamento de produtos...');
        
        const [carousel, featured] = await Promise.all([
          productService.getCarouselProducts(),
          productService.getFeaturedProducts()
        ]);
        
        console.log('Produtos carregados:', { carousel, featured });
        
        // Se não conseguiu carregar produtos da API, usa estáticos
        if (carousel.length === 0 && featured.length === 0) {
          console.log('Nenhum produto encontrado na API, usando produtos estáticos');
          const staticProducts = getStaticProducts();
          setCarouselProducts(staticProducts);
          setFeaturedProducts(staticProducts.slice(0, 3));
        } else {
          setCarouselProducts(carousel);
          setFeaturedProducts(featured);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Erro ao carregar produtos. Usando produtos de exemplo.');
        
        // Sempre usa produtos estáticos como fallback
        const staticProducts = getStaticProducts();
        setCarouselProducts(staticProducts);
        setFeaturedProducts(staticProducts.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Adicionar este useEffect para debug
  useEffect(() => {
    console.log('Estado atual:', {
      isLoading,
      error,
      carouselProductsLength: carouselProducts.length,
      featuredProductsLength: featuredProducts.length
    });
  }, [isLoading, error, carouselProducts, featuredProducts]);

  // Adicione este useEffect após os existentes
  useEffect(() => {
    console.log('Produtos do carrossel:', carouselProducts);
    carouselProducts.forEach((product, index) => {
      console.log(`Produto ${index + 1}:`, {
        name: product.name,
        image: product.image
      });
    });
  }, [carouselProducts]);

  // Função para ir para um slide específico
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  };

  // Funções de navegação do carrossel
  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % carouselProducts.length;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? carouselProducts.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  // Eventos de mouse/touch para arrastar
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartScrollLeft(currentIndex);
    setDragDistance(0);
    
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    
    const distance = clientX - startX;
    const slideWidth = carouselRef.current.offsetWidth;
    const dragPercentage = (distance / slideWidth) * 100;
    
    setDragDistance(distance);
    
    // Aplicar transformação durante o arraste
    const translateX = -(startScrollLeft * (100 / carouselProducts.length)) + (dragPercentage / carouselProducts.length);
    carouselRef.current.style.transform = `translateX(${translateX}%)`;
  };

  const handleEnd = () => {
    if (!isDragging || !carouselRef.current) return;
    
    setIsDragging(false);
    
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    const slideWidth = carouselRef.current.offsetWidth;
    const threshold = slideWidth * 0.2; // 20% da largura do slide
    
    let newIndex = currentIndex;
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Arrastar para direita (slide anterior)
        newIndex = currentIndex === 0 ? carouselProducts.length - 1 : currentIndex - 1;
      } else {
        // Arrastar para esquerda (próximo slide)
        newIndex = (currentIndex + 1) % carouselProducts.length;
      }
    }
    
    setCurrentIndex(newIndex);
    setDragDistance(0);
  };

  // Eventos de mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    handleEnd();
  };

  // Eventos de touch
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
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

  // Error state
  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
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
            {carouselProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="carousel-slide">
                  <div className="carousel-product-image">
                    <img src={product.image} alt={product.name} />
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