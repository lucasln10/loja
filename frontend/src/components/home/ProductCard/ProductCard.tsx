import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { Product } from '../../../types';
import { IoBagHandleSharp } from "react-icons/io5";

import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne a navegação quando clicar em "Adicionar"
    addToCart(product);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne a navegação dupla
    navigate(`/produto/${product.id}`);
  };

  const handleProductClick = () => {
    navigate(`/produto/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            // Fallback para uma imagem SVG simples
            e.currentTarget.src = 'images/logoSemFundo.svg';
          }}
        />
        <div className="product-overlay">
          <button className="quick-view-btn" onClick={handleViewDetails}>Ver Detalhes</button>
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">R$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <span className="btn-icon">{(IoBagHandleSharp as any)()}</span>
            <span className="btn-text">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;