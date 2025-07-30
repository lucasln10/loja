import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPasswordPage.css';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const token = searchParams.get('token');

  // Verifica se o token é válido ao carregar a página
  useEffect(() => {
    const verificarToken = async () => {
      if (!token) {
        setErro('Token não encontrado. O link pode estar inválido.');
        setVerificandoToken(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/auth/validate-reset-token?token=${token}`);
        if (response.data.status === 'valid') {
          setTokenValido(true);
          setUserEmail(response.data.email || '');
        } else {
          setErro('Token inválido ou expirado. Solicite um novo link de recuperação.');
        }
      } catch (err) {
        setErro('Token inválido ou expirado. Solicite um novo link de recuperação.');
      } finally {
        setVerificandoToken(false);
      }
    };

    verificarToken();
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenValido) {
      setErro('Token inválido. Não é possível redefinir a senha.');
      return;
    }

    if (password !== confirmPassword) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setEnviando(true);
    setErro('');
    setSucesso('');

    try {
      await axios.post(`http://localhost:8080/api/auth/reset-password?token=${token}`, {
        password: password
      });

      setSucesso('Senha redefinida com sucesso! Redirecionando para o login...');
      
      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      if (err.response?.data) {
        setErro(err.response.data);
      } else {
        setErro('Erro ao redefinir senha. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  if (verificandoToken) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="loading">
            <h2>Verificando token...</h2>
            <p>Aguarde enquanto validamos seu link de recuperação.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <h2 className="reset-password-title">Link Inválido</h2>
          
          <div className="error-message">
            {erro}
          </div>
          
          <div className="back-to-login">
            <p>
              <a href="/recuperar-senha">← Solicitar novo link</a>
            </p>
            <p>
              <a href="/login">← Voltar para o login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Redefinir Senha</h2>
        
        {userEmail && (
          <div className="user-info">
            <p>Redefinindo senha para: <strong>{userEmail}</strong></p>
          </div>
        )}

        <form className="reset-password-form" onSubmit={handleResetPassword}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Nova Senha</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Digite sua nova senha (mín. 6 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={enviando}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Digite novamente sua nova senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={enviando}
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-password-button"
            disabled={enviando}
          >
            {enviando ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>
        
        {erro && <div className="error-message">{erro}</div>}
        {sucesso && <div className="success-message">{sucesso}</div>}
        
        <div className="back-to-login">
          <p>
            <a href="/login">← Voltar para o login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
