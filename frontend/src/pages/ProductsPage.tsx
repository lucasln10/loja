import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryService, CategoryDTO } from '../services/categoryService';
import { productService } from '../services/productService';
import ProductCard from '../components/home/ProductCard/ProductCard';
import { Product } from '../types';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Carregar categorias
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Verificar se há uma categoria específica na URL
        const categoriaId = searchParams.get('categoria');
        
        if (categoriaId) {
          const categoryId = parseInt(categoriaId);
          const category = categoriesData.find(cat => cat.id === categoryId);
          setCurrentCategory(category || null);
          
          // Carregar produtos da categoria específica
          // Por enquanto, carrega todos os produtos (você pode filtrar no backend)
          const allProducts = await productService.getAllProducts();
          setProducts(allProducts);
        } else {
          // Carregar todos os produtos
          const allProducts = await productService.getAllProducts();
          setProducts(allProducts);
          setCurrentCategory(null);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const getPageTitle = () => {
    if (currentCategory) {
      return currentCategory.name;
    }
    return 'Todos os Produtos';
  };

  if (isLoading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>{getPageTitle()}</h1>
          {currentCategory ? (
            <p>Produtos da categoria: <strong>{currentCategory.name}</strong></p>
          ) : (
            <p>Explore nossa coleção completa de moldes</p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Nenhum produto encontrado para esta categoria.</p>
          </div>
        )}

        {/* Debug info - remova em produção */}
        <div className="debug-info">
          <p>Categoria ID: {searchParams.get('categoria') || 'Todas'}</p>
          <p>Categoria Nome: {searchParams.get('nome') || 'Todas'}</p>
          <p>Produtos encontrados: {products.length}</p>
          <p>Categorias disponíveis: {categories.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;