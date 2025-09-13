import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryManager from './CategoryManager';

// Mock do categoryService
jest.mock('../../services/categoryService', () => ({
  categoryService: {
    getAllCategories: jest.fn().mockResolvedValue([
      { id: 1, name: 'Categoria 1', showInHeader: true, headerOrder: 0 },
      { id: 2, name: 'Categoria 2', showInHeader: false, headerOrder: 1 }
    ]),
    getHeaderCategories: jest.fn().mockResolvedValue([
      { id: 1, name: 'Categoria 1', showInHeader: true, headerOrder: 0 }
    ]),
    getSubcategories: jest.fn().mockResolvedValue([]),
    createCategory: jest.fn().mockResolvedValue({}),
    updateCategory: jest.fn().mockResolvedValue({}),
    deleteCategory: jest.fn().mockResolvedValue(undefined),
    updateHeaderOrder: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('CategoryManager', () => {
  const mockAuthToken = 'test-token';

  it('deve renderizar o componente CategoryManager', () => {
    render(<CategoryManager authToken={mockAuthToken} />);
    
    // Verifica se o título "Gerenciar Categorias" está presente
    expect(screen.getByText('Gerenciar Categorias')).toBeInTheDocument();
  });

  it('deve exibir o formulário de categoria', () => {
    render(<CategoryManager authToken={mockAuthToken} />);
    
    // Verifica se o formulário está presente
    expect(screen.getByText('Adicionar Nova Categoria')).toBeInTheDocument();
  });
});