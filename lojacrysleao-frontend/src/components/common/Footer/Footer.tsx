import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img 
                  src="/images/logo.webp" 
                  alt="Crys Leão Logo" 
                  className="footer-logo-image"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="footer-logo-fallback">👩‍🍳</div>
              </div>
              <div className="footer-logo-text">
                <h3>Crys Leão</h3>
                <p>Moldes para Bolos</p>
              </div>
            </div>
            <p className="footer-description">
              Transforme suas ideias em bolos incríveis com nossos moldes de alta qualidade.
            </p>
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
            <h4>Contato</h4>
            <div className="contact-info">
              <p>📧 contato@crysleao.com.br</p>
              <p>📱 (11) 99999-9999</p>
              <p>📍 São Paulo, SP</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">📞 WhatsApp</a>
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