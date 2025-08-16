import React, { useState } from 'react';
import axios from 'axios';
import './RecoverPasswordPage.css';

const RecoverPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    setSucesso('');

    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email
      });

      setSucesso('Um e-mail com instruções para recuperação da senha foi enviado para seu endereço.');
      setEmail('');
    } catch (err) {
      setErro('E-mail não encontrado. Verifique se digitou corretamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="rp-recover-password-page">
      <div className="rp-recover-password-container">
        <h2 className="rp-recover-password-title">Recuperar Senha</h2>
        
        <div className="rp-recover-password-instructions">
          <p>Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.</p>
        </div>

        <form className="rp-recover-password-form" onSubmit={handleRecoverPassword}>
          <div className="rp-form-group">
            <label className="rp-form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="rp-form-input"
              placeholder="Digite seu e-mail cadastrado"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={enviando}
            />
          </div>
          
          <button 
            type="submit" 
            className="rp-recover-password-button"
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar Instruções'}
          </button>
        </form>
        
        {erro && <div className="rp-error-message">{erro}</div>}
        {sucesso && <div className="rp-success-message">{sucesso}</div>}
        
        <div className="rp-back-to-login">
          <p>
            <a href="/login">← Voltar para o login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
