import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmailPage.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [verificando, setVerificando] = useState(true);
  const [verificado, setVerificado] = useState(false);

  const token = searchParams.get('token');

  // Verifica o email automaticamente ao carregar a página
  useEffect(() => {
    const verificarEmail = async () => {
      if (!token) {
        setErro('Token não encontrado. O link pode estar inválido.');
        setVerificando(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/auth/verify-email?token=${token}`);
        
        setSucesso('Email verificado com sucesso! Sua conta está ativa e você já pode fazer login.');
        setVerificado(true);
        
        // Redireciona para o login após 5 segundos
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        
      } catch (err: any) {
        if (err.response?.data) {
          setErro(err.response.data);
        } else {
          setErro('Erro ao verificar email. O token pode estar inválido ou expirado.');
        }
      } finally {
        setVerificando(false);
      }
    };

    verificarEmail();
  }, [token, navigate]);

  const handleResendEmail = async () => {
    // Para reenviar, vamos redirecionar para uma página onde o usuário pode digitar o email
    navigate('/reenviar-verificacao');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (verificando) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <h2>Verificando seu email...</h2>
            <p>Aguarde enquanto validamos sua conta.</p>
          </div>
        </div>
      </div>
    );
  }

  if (verificado) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-container">
          <div className="success-icon">✅</div>
          <h2 className="verify-email-title">Email Verificado!</h2>
          
          <div className="success-message">
            {sucesso}
          </div>
          
          <div className="countdown-info">
            <p>Você será redirecionado para o login em alguns segundos...</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="login-button"
              onClick={handleGoToLogin}
            >
              Ir para Login Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        <div className="error-icon">❌</div>
        <h2 className="verify-email-title">Erro na Verificação</h2>
        
        <div className="error-message">
          {erro}
        </div>
        
        <div className="help-text">
          <p>Possíveis motivos:</p>
          <ul>
            <li>O link já foi usado anteriormente</li>
            <li>O link expirou (links são válidos por tempo limitado)</li>
            <li>O link está malformado ou incompleto</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <button 
            className="resend-button"
            onClick={handleResendEmail}
          >
            Reenviar Email de Verificação
          </button>
          
          <button 
            className="login-button secondary"
            onClick={handleGoToLogin}
          >
            Ir para Login
          </button>
        </div>
        
        <div className="back-to-home">
          <p>
            <a href="/">← Voltar para início</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
