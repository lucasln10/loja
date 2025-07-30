import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';
import { FaShoppingCart } from "react-icons/fa";

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">{(FaShoppingCart as any)()}</div>
            <h1>Seu Carrinho está Vazio</h1>
            <p>Que tal adicionar alguns moldes incríveis?</p>
            <button className="continue-shopping-btn">
              🧁 Ver Produtos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>🛒 Seu Carrinho</h1>
          <p>{state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'} adicionado{state.itemCount !== 1 ? 's' : ''}</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {state.items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkE4MDcyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+HtyBNb2xkZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-description">{item.description}</p>
                </div>

                <div className="item-quantity">
                  <label>Quantidade:</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  <div className="unit-price">R$ {item.price.toFixed(2)}</div>
                  <div className="total-price">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Remover item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumo do Pedido</h3>
              
              <div className="summary-line">
                <span>Subtotal ({state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'}):</span>
                <span>R$ {state.total.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              
              <div className="summary-line total-line">
                <span>Total:</span>
                <span>R$ {state.total.toFixed(2)}</span>
              </div>

              <div className="cart-actions">
                <button className="checkout-btn">
                  💳 Finalizar Compra
                </button>
                
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  🗑️ Limpar Carrinho
                </button>
                
                <button className="continue-shopping-btn">
                  ← Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;