import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          
          <div className="footer-section">
            <h4>Contato</h4>
            <div className="contact-info">
              <p>contato@crysleao.com.br</p>
              <p>(11) 99999-9999</p>
              <p>Rio de Janeiro, RJ</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Links Rápidos</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#produtos">Produtos</a></li>
              <li><a href="#sobre">Sobre Nós</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>

          
          <div className="footer-section">
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Crys Leão - Moldes para Bolos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;