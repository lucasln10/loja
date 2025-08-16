import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { categoryService, CategoryDTO } from '../../../services/categoryService';
import './Header.css';
import { IoBagHandleSharp } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";


interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {  
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { state } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Carregar categorias da API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Fallback para categorias estáticas se a API falhar
        setCategories([
          { id: 1, name: 'PROMOÇÕES' },
          { id: 2, name: 'CORTADORES' },
          { id: 3, name: 'MOLDES DE SILICONE' },
          { id: 4, name: 'POLYMER CLAY' },
          { id: 5, name: 'UTENSÍLIOS' },
          { id: 6, name: 'FORMAS DE ACETATO' },
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
  // Navegar para a página de produtos com o termo de busca
  navigate(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
      // Limpar o campo de busca após a navegação
      setSearchQuery('');
    }
  };

  // Função para navegar para categorias
  const handleCategoryNavigation = (categoryId: number, categoryName: string) => {
    const categorySlug = categoryName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    onPageChange(categorySlug);
    navigate(`/produtos?categoria=${categoryId}&nome=${categorySlug}`);
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
            {isAuthenticated ? (
              <>
                <span>Olá, {user?.name}!</span>
                {isAdmin && (
                  <button 
                    className="admin-btn"
                    onClick={() => onPageChange('admin')}
                  >
                    ADMIN
                  </button>
                )}
                <button 
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  SAIR
                </button>
              </>
            ) : (
              <>
                <span>Seja Bem-vinda(o)!</span>
                <button 
                  className="login-btn"
                  onClick={() => navigate('/login')}
                >
                  LOGIN
                </button>
                <span>ou</span>
                <button 
                  className="register-btn"
                  onClick={() => navigate('/registrar')}
                >
                  CADASTRE-SE
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barra principal com logo, busca e contato */}
      <div className="header-main">
        <div className="header-main-container">
          <div className="logo" onClick={() => navigate('/')}>
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
              <p>Moldes para Doces Personalizados e Biscuit</p>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar produtos ou categorias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={!searchQuery.trim()}
              title="Buscar produtos"
            >
              <span className="search-icon">{(FaMagnifyingGlass as any)()}</span>
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
              onClick={() => navigate('/carrinho')}
            >
              <span className="cart-icon">{(IoBagHandleSharp as any)()}</span>
              {state.itemCount > 0 && (
                <span className="cart-badge">{state.itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de navegação com categorias dinâmicas */}
      <div className="header-nav">
        <div className="header-nav-container">
          <nav className="nav">
            <ul className="nav-list">
              {isLoadingCategories ? (
                <li className="nav-item">
                  <span className="nav-link">Carregando...</span>
                </li>
              ) : (
                categories.map(category => (
                  <li key={category.id} className="nav-item">
                    <button
                      className={`nav-link ${currentPage === category.name.toLowerCase().replace(/\s+/g, '-') ? 'nav-link--active' : ''}`}
                      onClick={() => handleCategoryNavigation(category.id!, category.name)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;