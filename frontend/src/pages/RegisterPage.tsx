// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        phone,
        cpf,
        password,
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        /><br />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={e => setCpf(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <p>Já tem conta? <a href="/login">Faça login</a></p>
    </div>
  );
};

export default RegisterPage;
