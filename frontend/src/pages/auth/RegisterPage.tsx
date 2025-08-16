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
  const [sucesso, setSucesso] = useState('');
  const [cadastrando, setCadastrando] = useState(false);
  const [cadastroCompleto, setCadastroCompleto] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setCadastrando(true);
    setErro('');
    setSucesso('');
    
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        phone,
        cpf,
        password,
      });

      setSucesso(`Cadastro realizado com sucesso! Um email de verificação foi enviado para ${email}. Verifique sua caixa de entrada e spam.`);
      setCadastroCompleto(true);
      
      // Redireciona para login após 8 segundos
      //setTimeout(() => {
      //  navigate('/login');
      //}, 8000);
      
    } catch (err: any) {
      if (err.response?.data) {
        setErro(err.response.data.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
      } else {
        setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
      }
    } finally {
      setCadastrando(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/resend-verification', {
        email
      });
      setSucesso(`Novo email de verificação enviado para ${email}. Verifique sua caixa de entrada e spam.`);
    } catch (err) {
      setErro('Erro ao reenviar email. Tente novamente.');
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
    <div className="rep-register-page">
      <div className="rep-register-container">
        <h2 className="rep-register-title">
          {cadastroCompleto ? 'Cadastro Realizado!' : 'Criar Conta'}
        </h2>
        
        {!cadastroCompleto ? (
          <>
            <form className="rep-register-form" onSubmit={handleRegister}>
              <div className="rep-form-group">
                <label className="rep-form-label" htmlFor="name">Nome Completo</label>
                <input
                  id="name"
                  type="text"
                  className="rep-form-input"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={cadastrando}
                />
              </div>
              <div className="rep-form-group">
                <label className="rep-form-label" htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  type="text"
                  className="rep-form-input"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={e => setCpf(formatCpf(e.target.value))}
                  maxLength={14}
                  required
                  disabled={cadastrando}
                />
              </div>
              <div className="rep-form-group">
                <label className="rep-form-label" htmlFor="phone">Telefone</label>
                <input
                  id="phone"
                  type="text"
                  className="rep-form-input"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))}
                  maxLength={15}
                  required
                  disabled={cadastrando}
                />
              </div>
              <div className="rep-form-group">
                <label className="rep-form-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="rep-form-input"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={cadastrando}
                />
              </div>

              <div className="rep-form-group">
                <label className="rep-form-label" htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  className="rep-form-input"
                  placeholder="Digite uma senha (mín. 6 caracteres)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={cadastrando}
                />
              </div>

              <button 
                type="submit" 
                className="rep-register-button"
                disabled={cadastrando}
              >
                {cadastrando ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>

            <div className="rep-login-link">
              <p>Já tem uma conta? <a href="/login">Faça login aqui</a></p>
            </div>
          </>
        ) : (
          <>
            <div className="rep-verification-info">
              <div className="rep-email-icon">📧</div>
              <h3>Verifique seu email</h3>
              <p>Quase pronto! Para ativar sua conta, clique no link que enviamos para:</p>
              <div className="rep-email-highlight">{email}</div>
            </div>

            <div className="rep-verification-instructions">
              <h4>Próximos passos:</h4>
              <ol>
                <li>Abra seu email e procure por uma mensagem da Loja Crysleão</li>
                <li>Clique no link "Verificar conta" no email</li>
                <li>Após verificar, faça login com suas credenciais</li>
              </ol>
              <p><strong>Dica:</strong> Se não encontrou o email, verifique a pasta de spam.</p>
            </div>

            <div className="rep-action-buttons">
              <button 
                className="rep-resend-button"
                onClick={handleResendVerification}
              >
                Reenviar Email
              </button>
              
              <button 
                className="rep-login-button"
                onClick={() => navigate('/login')}
              >
                Ir para Login
              </button>
            </div>

            <div className="rep-countdown-info">
              <p>Você será redirecionado automaticamente para o login em alguns segundos...</p>
            </div>
          </>
        )}

        {erro && <div className="rep-error-message">{erro}</div>}
        {sucesso && <div className="rep-success-message">{sucesso}</div>}
      </div>
    </div>
  );
};

export default RegisterPage;
