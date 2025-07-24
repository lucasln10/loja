import React, { useState } from 'react';
import ProductCard from '../components/home/ProductCard/ProductCard';
import { Product } from '../types';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-page">
      {/* Carrossel de Produtos */}
      <section className="hero-carousel">
        <div className="carousel-container">
          <div className="carousel-content">
            <div className="carousel-text">
              <h1>✨ Moldes Exclusivos Crys Leão</h1>
              <p>Descubra nossa coleção especial de moldes para criar bolos extraordinários</p>
              <div className="carousel-features">
                <div className="feature">
                  <span className="feature-icon">🎂</span>
                  <span>Qualidade Premium</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⭐</span>
                  <span>Designs Únicos</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <span>Entrega Rápida</span>
                </div>
              </div>
            </div>

            <div className="carousel-products">
              <div className="carousel-wrapper">
                <div 
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselProducts.map((product) => (
                    <div key={product.id} className="carousel-slide">
                      <div className="carousel-product-card">
                        <div className="carousel-product-image">
                          <img src={product.image} alt={product.name} />
                          <div className="product-badge">{product.category}</div>
                        </div>
                        <div className="carousel-product-info">
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className="product-price">R$ {product.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles do Carrossel */}
              <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
                ❮
              </button>
              <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
                ❯
              </button>

              {/* Indicadores */}
              <div className="carousel-indicators">
                {carouselProducts.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
      <section className="featured-products">
        <div className="container">
          <h2>🧁 Produtos em Destaque</h2>
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
          <h2>💝 Por que escolher a Crys Leão?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎨</div>
              <h3>Design Exclusivo</h3>
              <p>Moldes únicos criados especialmente para deixar seus bolos extraordinários</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Qualidade Garantida</h3>
              <p>Materiais de primeira linha que garantem durabilidade e resultados perfeitos</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💖</div>
              <h3>Feito com Amor</h3>
              <p>Cada molde é pensado para ajudar você a criar momentos especiais</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;