import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryService, CategoryDTO } from '../services/categoryService';
import { productService } from '../services/productService';
import ProductCard from '../components/home/ProductCard/ProductCard';
import { Product } from '../types';
import { useScrollToTopOnNavigation } from '../hooks/useScrollToTop';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hook específico para navegação - monitora mudanças na URL
  useScrollToTopOnNavigation([searchParams.toString()]);

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
          
          // Carregar todos os produtos e filtrar pela categoria
          const allProducts = await productService.getAllProducts();
          console.log('📊 Todos os produtos carregados:', allProducts);
          console.log('🎯 Filtrando pela categoria ID:', categoryId);
          
          // Filtrar produtos que pertencem à categoria selecionada
          const filteredProducts = allProducts.filter(product => {
            // Assumindo que o produto tem um campo categoryId ou similar
            const productCategoryId = (product as any).categoryId;
            console.log(`Produto ${product.name}: categoryId = ${productCategoryId}, comparando com ${categoryId}`);
            return productCategoryId === categoryId;
          });
          
          console.log('✅ Produtos filtrados:', filteredProducts);
          setProducts(filteredProducts);
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
        {/* <div className="debug-info">
          <p>Categoria ID: {searchParams.get('categoria') || 'Todas'}</p>
          <p>Categoria Nome: {searchParams.get('nome') || 'Todas'}</p>
          <p>Produtos encontrados: {products.length}</p>
          <p>Categorias disponíveis: {categories.length}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ProductsPage;