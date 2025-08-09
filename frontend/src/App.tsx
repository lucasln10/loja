// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop';

import HomePage from './pages/client/HomePage';
import ProductsPage from './pages/client/ProductsPage';
import AboutPage from './pages/client/AboutPage';
import ContactPage from './pages/client/ContactPage';
import CartPage from './pages/client/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminPage from './pages/admin/AdminPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResendVerificationPage from './pages/auth/ResendVerificationPage';
import ProductDetailPage from './pages/client/ProductDetailPage';

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
      'produtos': '/produtos',
      'promocoes': '/produtos?categoria=promocoes',
      'cortadores': '/produtos?categoria=cortadores',
      'moldes-silicone': '/produtos?categoria=moldes-silicone',
      'polymer-clay': '/produtos?categoria=polymer-clay',
      'utensilios': '/produtos?categoria=utensilios',
      'formas-acetato': '/produtos?categoria=formas-acetato',
      'carrinho': '/carrinho',
      'login': '/login',
      'registrar': '/registrar',
      'recuperar-senha': '/recuperar-senha',
      'redefinir-senha': '/redefinir-senha',
      'verificar-email': '/verificar-email',
      'reenviar-verificacao': '/reenviar-verificacao',
      'sobre': '/sobre',
      'contato': '/contato',
      'admin': '/admin'
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
    } else if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/recuperar-senha') {
      setCurrentPage('recuperar-senha');
    } else if (path === '/redefinir-senha') {
      setCurrentPage('redefinir-senha');
    } else if (path === '/verificar-email') {
      setCurrentPage('verificar-email');
    } else if (path === '/reenviar-verificacao') {
      setCurrentPage('reenviar-verificacao');
    } 
  }, [location]);

  return (
    <div className="App">
      <ScrollToTop />
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
          <Route path="/verificar-email" element={<VerifyEmailPage />} />
          <Route path="/reenviar-verificacao" element={<ResendVerificationPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/produto/:id" element={<ProductDetailPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;