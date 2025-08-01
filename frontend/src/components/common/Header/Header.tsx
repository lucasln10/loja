import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import './Header.css';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useCart();

  const navigationItems = [
    { id: 'promocoes', label: 'PROMOÇÕES' },
    { id: 'cortadores', label: 'CORTADORES' },
    { id: 'moldes-silicone', label: 'MOLDES DE SILICONE' },
    { id: 'polymer-clay', label: 'POLYMER CLAY' },
    { id: 'utensilios', label: 'UTENSÍLIOS' },
    { id: 'formas-acetato', label: 'FORMAS DE ACETATO' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscar por:', searchQuery);
  };

  return (
    <header className="header">
      {/* Barra superior com frete grátis */}
      <div className="header-top">
        <div className="header-top-container">
          <div className="free-shipping">
            <span className="shipping-icon">📦</span>
            <span>FRETE GRÁTIS</span>
            <span className="shipping-conditions">CONFIRA CONDIÇÕES</span>
          </div>
          <div className="header-top-actions">
            <span>Seja Bem-vinda(o)!</span>
            <button className="login-btn">LOGIN</button>
            <span>ou</span>
            <button className="register-btn">CADASTRE-SE</button>
          </div>
        </div>
      </div>

      {/* Barra principal com logo, busca e contato */}
      <div className="header-main">
        <div className="header-main-container">
          <div className="logo" onClick={() => onPageChange('home')}>
            <div className="logo-icon">
              <img 
                src="/images/logo.webp" 
                alt="Crys Leão Logo" 
                className="logo-image"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            </div>
            <div className="logo-text">
              <h1>Crys Leão</h1>
              <p>Moldes para Doces Personalizados</p>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Digite o que você procura"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>

          <div className="header-main-actions">
            <div className="contact-info">
                <div className="contact-details">
                  <span className="phone">(99) 99999-9999</span>
                  <span className="schedule">Segunda a sexta 8h às 18h</span>
                  <span className="schedule">Sábados 8h às 12h</span>
              </div>
            </div>

            <button
              className="cart-button"
              onClick={() => onPageChange('carrinho')}
            >
              <span className="cart-icon">🛒</span>
              {state.itemCount > 0 && (
                <span className="cart-badge">{state.itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de navegação com categorias */}
      <div className="header-nav">
        <div className="header-nav-container">
          <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
            <ul className="nav-list">
              {navigationItems.map(item => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${currentPage === item.id ? 'nav-link--active' : ''}`}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;