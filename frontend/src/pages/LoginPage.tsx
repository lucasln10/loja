import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password: senha
      });

      localStorage.setItem('token', response.data.accessToken);
      alert('Login realizado com sucesso!');
      navigate('/home');
    } catch (err) {
      setErro('E-mail ou senha inválidos');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Bem-vindo!</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Digite sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        
        {erro && <div className="error-message">{erro}</div>}
        
        <div className="register-link">
          <p><a href="/recuperar-senha">Esqueci minha senha</a></p>
        </div>
        <div className="register-link">
          <p>Não tem uma conta? <a href="/registrar">Cadastre-se aqui</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
