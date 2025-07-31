import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductManager from '../components/admin/ProductManager';
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
  stock: number;
  imageUrl?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para formulários
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    imageUrl: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // Verificar se o usuário é admin
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
  }, [user, isAdmin, navigate]);

  // Carregar dados
  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:8080/api/products'),
        axios.get('http://localhost:8080/api/categories'),
        axios.get('http://localhost:8080/api/admin/users')
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
        stock: parseInt(newProduct.stock),
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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/categories', {
        name: newCategory.name,
        description: newCategory.description
      });

      setNewCategory({
        name: '',
        description: ''
      });
      
      loadData();
      alert('Categoria adicionada com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar categoria');
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

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await axios.delete(`http://localhost:8080/api/categories/${categoryId}`);
        loadData();
        alert('Categoria excluída com sucesso!');
      } catch (error) {
        alert('Erro ao excluir categoria');
      }
    }
  };

  const handlePromoteUser = async (userId: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/promote/${userId}`);
      loadData();
      alert('Usuário promovido para ADMIN com sucesso!');
    } catch (error) {
      alert('Erro ao promover usuário');
    }
  };

  const handleDemoteUser = async (userId: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/demote/${userId}`);
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

        {activeTab === 'categories' && (
          <div className="categories-section">
            <h2>Gerenciar Categorias</h2>
            
            <div className="add-form">
              <h3>Adicionar Nova Categoria</h3>
              <form onSubmit={handleAddCategory}>
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
                <button type="submit">Adicionar Categoria</button>
              </form>
            </div>

            <div className="categories-list">
              <h3>Categorias Existentes</h3>
              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category.id} className="category-card">
                    <h4>{category.name}</h4>
                    {category.description && <p>{category.description}</p>}
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-btn"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Gerenciar Usuários</h2>
            
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