import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import './index.css'; // se tiver estilos globais

if (process.env.NODE_ENV === 'development') {
  if (!document.getElementById('react-devtools')) {
    const s = document.createElement('script');
    s.id = 'react-devtools';
    s.src = 'http://localhost:8097';
    document.head.appendChild(s);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Ensure Authorization header is set before any component mounts
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);