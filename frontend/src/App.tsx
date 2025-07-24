import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'produtos':
        return <ProductsPage />;
      case 'sobre':
        return <AboutPage />;
      case 'contato':
        return <ContactPage />;
      case 'carrinho':
        return <CartPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <CartProvider>
      <div className="App">
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="main-content">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;