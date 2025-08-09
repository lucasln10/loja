import React from 'react';
import { useCart } from '../../context/CartContext';

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh' }}>
        <h1>🛒 Seu Carrinho</h1>
        <p>Seu carrinho está vazio!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', minHeight: '50vh' }}>
      <h1>🛒 Seu Carrinho ({state.itemCount} items)</h1>
      <div>
        {state.items.map(item => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem 0' }}>
            <h3>{item.name}</h3>
            <p>Preço: R$ {item.price.toFixed(2)}</p>
            <p>Quantidade: {item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)}>Remover</button>
          </div>
        ))}
        <div style={{ marginTop: '2rem' }}>
          <h2>Total: R$ {state.total.toFixed(2)}</h2>
          <button onClick={clearCart} style={{ marginRight: '1rem' }}>Limpar Carrinho</button>
          <button>Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
};

const ContactPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh' }}>
      <h1>📞 Contato</h1>
      <p>Entre em contato conosco para dúvidas e pedidos especiais!</p>
    </div>
  );
};

export default CartPage;