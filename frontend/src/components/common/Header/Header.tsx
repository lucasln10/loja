import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import './Header.css';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'produtos', label: 'Produtos', icon: '🧁' },
    { id: 'sobre', label: 'Sobre', icon: '💝' },
    { id: 'contato', label: 'Contato', icon: '📞' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => onPageChange('home')}>
          <div className="logo-icon">
            <img 
              src="/images/logo.webp" 
              alt="Crys Leão Logo" 
              className="logo-image"
              onError={(e) => {
                // Fallback para emoji se a imagem não carregar
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <div className="logo-fallback">👩‍🍳</div>
          </div>
          <div className="logo-text">
            <h1>Crys Leão</h1>
            <p>Moldes para Bolos</p>
          </div>
        </div>

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
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="cart-button"
            onClick={() => onPageChange('carrinho')}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Carrinho</span>
            {state.itemCount > 0 && (
              <span className="cart-badge">{state.itemCount}</span>
            )}
          </button>

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