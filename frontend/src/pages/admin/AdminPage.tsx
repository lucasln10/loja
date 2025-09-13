import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductManager from '../../components/admin/ProductManager';
import StockManager from '../../components/admin/StockManager';
import CarouselManager from '../../components/admin/CarouselManager';
import CategoryManager from '../../components/admin/CategoryManager'; // Adicionando o import do CategoryManager
import './AdminPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  quantity: number;
  imageUrl?: string;
  imageUrls?: string[];
}

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

const AdminPage: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deeplinkProductId, setDeeplinkProductId] = useState<number | null>(null);

  // Estados para formulários
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    imageUrl: ''
  });

  // Verificar se o usuário é admin e aplicar deep-link inicial
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      alert('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/');
      return;
    }

    // deep-link: /admin?tab=stock&productId=123
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'stock') {
      setActiveTab('stock');
    }
    const pid = params.get('productId');
    if (pid) {
      const n = parseInt(pid, 10);
      if (!isNaN(n)) setDeeplinkProductId(n);
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    const pid = params.get('productId');
    if (pid) {
      const n = parseInt(pid, 10);
      if (!isNaN(n)) setDeeplinkProductId(n);
    } else {
      setDeeplinkProductId(null);
    }
  }, [location.search, isAdmin]);

  // Carregar dados
  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const authCfg = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
      const results = await Promise.allSettled([
        axios.get('http://localhost:8080/api/products'),
        // usar fetch sem Authorization para evitar 401 por token inválido em endpoint público
        fetch('http://localhost:8080/api/categories'),
        axios.get('http://localhost:8080/api/admin/users', authCfg)
      ]);

      const [productsRes, categoriesRes, usersRes] = results;

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data);
      } else {
        console.warn('Falha ao carregar produtos:', productsRes.reason);
      }

      if (categoriesRes.status === 'fulfilled') {
        const resp = categoriesRes.value as Response;
        if (resp.ok) {
          const data = await resp.json();
          setCategories(data);
          console.debug('Categorias carregadas:', data);
        } else {
          console.warn('Falha ao carregar categorias: HTTP', resp.status);
        }
      } else {
        console.warn('Falha ao carregar categorias:', categoriesRes.reason);
      }

      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.data);
        setUsersError(null);
      } else {
        console.warn('Falha ao carregar usuários (ignorado para exibir categorias):', usersRes.reason);
        setUsersError('Não foi possível carregar os usuários (verifique se está logado como ADMIN).');
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId),
        quantity: parseInt(newProduct.stock), // Corrigido: quantity em vez de stock
        imageUrl: newProduct.imageUrl
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        stock: '',
        imageUrl: ''
      });
      
      loadData();
      alert('Produto adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar produto');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${productId}`);
        loadData();
        alert('Produto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir produto');
      }
    }
  };

  const handlePromoteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/admin/promote/${userId}`,
        undefined,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      loadData();
      alert('Usuário promovido para ADMIN com sucesso!');
    } catch (error) {
      alert('Erro ao promover usuário');
    }
  };

  const handleDemoteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/admin/demote/${userId}`,
        undefined,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      loadData();
      alert('Usuário rebaixado para USER com sucesso!');
    } catch (error) {
      alert('Erro ao rebaixar usuário');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <div className="admin-user-info">
          <span>Bem-vindo, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </div>

      <div className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Produtos
        </button>
        <button 
          className={activeTab === 'stock' ? 'active' : ''} 
          onClick={() => setActiveTab('stock')}
        >
          Estoque
        </button>
        <button 
          className={activeTab === 'carousel' ? 'active' : ''} 
          onClick={() => setActiveTab('carousel')}
        >
          Carousel
        </button>
        <button 
          className={activeTab === 'categories' ? 'active' : ''} 
          onClick={() => setActiveTab('categories')}
        >
          Categorias
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Usuários
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Produtos</h3>
                <p>{products.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total de Categorias</h3>
                <p>{categories.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total de Usuários</h3>
                <p>{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Administradores</h3>
                <p>{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManager authToken={localStorage.getItem('token') || ''} />
        )}

        {activeTab === 'stock' && (
          <StockManager authToken={localStorage.getItem('token') || ''} selectedProductId={deeplinkProductId ?? undefined} />
        )}

        {activeTab === 'carousel' && (
          <CarouselManager />
        )}

        {activeTab === 'categories' && (
          <CategoryManager authToken={localStorage.getItem('token') || ''} />
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Gerenciar Usuários</h2>
            {usersError && (
              <div style={{ background: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: 8, marginBottom: 15 }}>
                {usersError}
              </div>
            )}
            
            <div className="users-list">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.role === 'USER' ? (
                          <button 
                            onClick={() => handlePromoteUser(user.id)}
                            className="promote-btn"
                          >
                            Promover para Admin
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDemoteUser(user.id)}
                            className="demote-btn"
                          >
                            Rebaixar para User
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 