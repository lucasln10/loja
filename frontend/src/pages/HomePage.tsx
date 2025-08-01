import React, { useRef, useState } from 'react';
import ProductCard from '../components/home/ProductCard/ProductCard';
import { Product } from '../types';
import './HomePage.css';
import { FaTruckFast } from "react-icons/fa6";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { TbBrandCake } from "react-icons/tb";




const HomePage: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  // Produtos para o carrossel - usando emojis como fallback
  const carouselProducts: Product[] = [
    {
      id: '1',
      name: 'Molde Coração Romântico',
      price: 45.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkE4MDcyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4p2kIE1vbGRlIENvcmHDp8OjbzwvdGV4dD48L3N2Zz4=',
      description: 'Perfeito para bolos de aniversário e celebrações românticas',
      category: 'Românticos'
    },
    {
      id: '2',
      name: 'Molde Flor Delicada',
      price: 52.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREMxNDNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MuCBNb2xkZSBGbG9yPC90ZXh0Pjwvc3ZnPg==',
      description: 'Design elegante em formato de flor para ocasiões especiais',
      category: 'Florais'
    },
    {
      id: '3',
      name: 'Molde Estrela Mágica',
      price: 38.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkE4MDcyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4q2QIE1vbGRlIEVzdHJlbGE8L3RleHQ+PC9zdmc+',
      description: 'Ideal para festas infantis e comemorações festivas',
      category: 'Infantis'
    },
    {
      id: '4',
      name: 'Molde Borboleta Encantada',
      price: 48.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREMxNDNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+mmiBCb3Jib2xldGE8L3RleHQ+PC9zdmc+',
      description: 'Delicado molde em formato de borboleta para ocasiões especiais',
      category: 'Florais'
    },
    {
      id: '5',
      name: 'Molde Castelo Princesa',
      price: 65.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkE4MDcyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+PsApDYXN0ZWxvPC90ZXh0Pjwvc3ZnPg==',
      description: 'Molde mágico de castelo para festas de princesas',
      category: 'Infantis'
    }
  ];

  // Função para ir para um slide específico
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      carouselRef.current.style.transform = `translateX(-${index * 20}%)`;
    }
  };

  // Funções de navegação do carrossel
  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % carouselProducts.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentIndex === 0 ? carouselProducts.length - 1 : currentIndex - 1;
    goToSlide(prevIndex);
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
    const slideWidth = carouselRef.current.offsetWidth / 5; // Largura de cada slide (20%)
    const dragPercentage = (distance / slideWidth) * 20; // Converte para porcentagem
    
    setDragDistance(distance);
    
    // Aplicar transformação durante o arraste
    const translateX = -(startScrollLeft * 20) + dragPercentage;
    carouselRef.current.style.transform = `translateX(${translateX}%)`;
  };

  const handleEnd = () => {
    if (!isDragging || !carouselRef.current) return;
    
    setIsDragging(false);
    
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    const slideWidth = carouselRef.current.offsetWidth / 5;
    const threshold = slideWidth * 0.2; // 20% da largura do slide
    
    let newIndex = currentIndex;
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Arrastou para a direita - slide anterior
        newIndex = currentIndex === 0 ? carouselProducts.length - 1 : currentIndex - 1;
      } else {
        // Arrastou para a esquerda - próximo slide
        newIndex = (currentIndex + 1) % carouselProducts.length;
      }
    }
    
    goToSlide(newIndex);
  };

  // Eventos de mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Eventos de touch para dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Produtos em destaque (diferentes do carrossel)
  const featuredProducts: Product[] = [
    {
      id: '6',
      name: 'Molde Rosa Vintage',
      price: 42.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkE4MDcyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MuSBSb3NhPC90ZXh0Pjwvc3ZnPg==',
      description: 'Estilo vintage com detalhes refinados',
      category: 'Vintage'
    },
    {
      id: '7',
      name: 'Molde Geométrico Moderno',
      price: 55.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREMxNDNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4pe9IEdlb23DqXRyaWNvPC90ZXh0Pjwvc3ZnPg==',
      description: 'Design contemporâneo para bolos modernos',
      category: 'Modernos'
    },
    {
      id: '8',
      name: 'Molde Folhas Naturais',
      price: 39.90,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkE4MDcyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NgyBGb2xoYXM8L3RleHQ+PC9zdmc+',
      description: 'Inspirado na natureza com detalhes realistas',
      category: 'Naturais'
    }
  ];

  return (
    <div className="home-page">
      {/* Carrossel de Produtos */}
      <section className="hero-carousel">
        <div className="carousel-container">
          <div className="carousel-products">
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
              ‹
            </button>
            <div className="carousel-wrapper">
              <div 
                className="carousel-track"
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateX(-${currentIndex * 20}%)`
                }}
              >
                {carouselProducts.map((product) => (
                  <div key={product.id} className="carousel-slide">
                    <div className="carousel-product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
              ›
            </button>
            
            {/* Dots de navegação */}
            <div className="carousel-dots">
              {carouselProducts.map((_, index) => (
                <div
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
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
            <button className="view-all-btn">
              Ver Todos os Produtos →
            </button>
          </div>
        </div>
      </section>

      {/* Seção Por que escolher */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Por que escolher a Crys Leão?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">{(TbBrandCake as any)()}</div>
              <h3>Design Exclusivo</h3>
              <p>Moldes únicos criados especialmente para deixar seus bolos extraordinários</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">{(IoShieldCheckmarkOutline as any)()}</div>
              <h3>Qualidade Garantida</h3>
              <p>Materiais de primeira linha que garantem durabilidade e resultados perfeitos</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">{(FaTruckFast as any)()}</div>
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