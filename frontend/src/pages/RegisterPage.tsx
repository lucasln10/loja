// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

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

  const formatCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const match = cleanValue.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleanValue;
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const match = cleanValue.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleanValue;
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Criar Conta</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                type="text"
                className="form-input"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={e => setCpf(formatCpf(e.target.value))}
                maxLength={14}
                required
              />
            </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Telefone</label>
              <input
                id="phone"
                type="text"
                className="form-input"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                maxLength={15}
                required
              />
            </div>
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
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Digite uma senha (mín. 6 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="register-button">
            Criar Conta
          </button>
        </form>

        {erro && <div className="error-message">{erro}</div>}

        <div className="login-link">
          <p>Já tem uma conta? <a href="/login">Faça login aqui</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
