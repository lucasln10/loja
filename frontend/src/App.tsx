// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import './App.css';

// Componente interno para gerenciar a navegação
function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  // Função para navegar entre páginas
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    
    // Mapeamento das páginas para rotas
    const pageToRoute: { [key: string]: string } = {
      'home': '/',
      'promocoes': '/produtos?categoria=promocoes',
      'cortadores': '/produtos?categoria=cortadores',
      'moldes-silicone': '/produtos?categoria=moldes-silicone',
      'polymer-clay': '/produtos?categoria=polymer-clay',
      'utensilios': '/produtos?categoria=utensilios',
      'formas-acetato': '/produtos?categoria=formas-acetato',
      'carrinho': '/carrinho',
      'login': '/login',
      'registrar': '/registrar',
      'sobre': '/sobre',
      'contato': '/contato'
    };

    const route = pageToRoute[page] || '/';
    navigate(route);
  };

  // Define a página atual baseada na rota
  React.useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const categoria = searchParams.get('categoria');
    
    if (path === '/' || path === '/home') {
      setCurrentPage('home');
    } else if (path === '/produtos' && categoria) {
      setCurrentPage(categoria);
    } else if (path === '/carrinho') {
      setCurrentPage('carrinho');
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/sobre') {
      setCurrentPage('sobre');
    } else if (path === '/contato') {
      setCurrentPage('contato');
    } else if (path === '/registrar') {
      setCurrentPage('registrar');
    } 
  }, [location]);

  return (
    <div className="App">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;