import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        /><br />
        <button type="submit">Entrar</button>
      </form>
      {erro && <p style={{color: 'red'}}>{erro}</p>}
    </div>
  );
};

export default LoginPage;
