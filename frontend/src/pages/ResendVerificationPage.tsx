import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResendVerificationPage.css';

const ResendVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    setSucesso('');

    try {
      await axios.post('http://localhost:8080/api/auth/resend-verification', {
        email
      });

      setSucesso('Um novo email de verificação foi enviado para seu endereço. Verifique sua caixa de entrada e spam.');
      setEmail('');
      
      // Redireciona para login após 5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (err: any) {
      if (err.response?.data) {
        setErro(err.response.data);
      } else {
        setErro('Erro ao reenviar email. Verifique se o endereço está correto.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="resend-verification-page">
      <div className="resend-verification-container">
        <h2 className="resend-verification-title">Reenviar Verificação</h2>
        
        <div className="resend-verification-instructions">
          <p>Digite seu e-mail cadastrado e enviaremos um novo link de verificação.</p>
        </div>

        <form className="resend-verification-form" onSubmit={handleResendVerification}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Digite seu e-mail cadastrado"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={enviando}
            />
          </div>
          
          <button 
            type="submit" 
            className="resend-verification-button"
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Reenviar Verificação'}
          </button>
        </form>
        
        {erro && <div className="error-message">{erro}</div>}
        {sucesso && <div className="success-message">{sucesso}</div>}
        
        <div className="back-links">
          <p>
            <a href="/login">← Voltar para o login</a>
          </p>
          <p>
            <a href="/">← Voltar para início</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
