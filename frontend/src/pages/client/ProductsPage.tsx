import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { categoryService, CategoryDTO } from '../../services/categoryService';
import { productService } from '../../services/productService';
import ProductCard from '../../components/home/ProductCard/ProductCard';
import { Product } from '../../types';
import { useScrollToTopOnNavigation } from '../../hooks/useScrollToTop';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  useScrollToTopOnNavigation([searchParams.toString()]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carregar categorias e produtos em paralelo
        const [categoriesData, productsData] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getAllProductsWithCategories()
        ]);

        setCategories(categoriesData);
        setAllProducts(productsData);
        
        // Verificar parâmetros de URL
        const categoriaParam = searchParams.get('categoria');
        const searchTerm = (searchParams.get('q') || '').trim().toLowerCase();

        // Helper para slugificar nomes de categoria
        const slugify = (s: string) => s
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');
        
        // Mapa id -> nome da categoria (lower) para facilitar busca por nome
        const categoryNameById = new Map<number, string>(
          categoriesData
            .filter(c => typeof c.id === 'number')
            .map(c => [c.id as number, (c.name || '').toLowerCase()])
        );
        
        if (categoriaParam) {
          // Detectar categoria por ID numérico ou por slug/nome
          let categoryId: number | null = null;
          let category: CategoryDTO | undefined;

          const parsedId = parseInt(categoriaParam, 10);
          if (!isNaN(parsedId)) {
            categoryId = parsedId;
            category = categoriesData.find(cat => cat.id === parsedId);
          } else {
            const targetSlug = slugify(categoriaParam);
            category = categoriesData.find(cat => slugify(cat.name) === targetSlug);
            if (category && typeof category.id === 'number') {
              categoryId = category.id as number;
            }
          }

          setCurrentCategory(category || null);
          
          // Filtrar produtos pela categoria
          let filteredProducts = productsData.filter(product => 
            categoryId !== null && product.categoryId === categoryId
          );
          // Se houver termo de busca, refinar pelo termo
          if (searchTerm) {
            filteredProducts = filteredProducts.filter(p =>
              p.name.toLowerCase().includes(searchTerm) ||
              (p.description || '').toLowerCase().includes(searchTerm) ||
              (categoryNameById.get(p.categoryId || 0) || '').includes(searchTerm)
            );
          }
          
          setProducts(filteredProducts);
        } else {
          // Sem categoria específica
          if (searchTerm) {
            // Filtrar por termo de busca em nome, descrição ou categoria
            const filteredBySearch = productsData.filter(p => {
              const catName = categoryNameById.get(p.categoryId || 0) || '';
              return (
                p.name.toLowerCase().includes(searchTerm) ||
                (p.description || '').toLowerCase().includes(searchTerm) ||
                catName.includes(searchTerm)
              );
            });
            setProducts(filteredBySearch);
          } else {
            // Mostrar todos os produtos
            setProducts(productsData);
          }
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

  // Função para filtrar e ordenar produtos
  const filterAndSortProducts = (productsToFilter: Product[]) => {
    let filtered = [...productsToFilter];
    
    // Filtro por preço
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Ordenação
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    return filtered;
  };

  const handleCategoryChange = (categoryId: number | null) => {
    if (categoryId) {
      navigate(`/produtos?categoria=${categoryId}`);
    } else {
      navigate('/produtos');
    }
  };

  // const getPageTitle = () => {
  //   if (currentCategory) {
  //     return currentCategory.name;
  //   }
  //   return 'Todos os Produtos';
  // };

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Produtos', path: '/produtos' }
    ];
    
    const searchTerm = (searchParams.get('q') || '').trim();
    if (currentCategory) {
      items.push({ 
        label: currentCategory.name, 
        path: `/produtos?categoria=${currentCategory.id}` 
      });
    } else if (searchTerm) {
      items.push({
        label: `"${searchTerm}"`,
        path: `/produtos?q=${encodeURIComponent(searchTerm)}`
      });
    }
    
    return items;
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

  const filteredProducts = filterAndSortProducts(products);

  return (
    <div className="products-page">
      <div className="container">
        {/* Breadcrumb dinâmico */}
        <nav className="breadcrumb">
          {getBreadcrumbItems().map((item, index, array) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {index === array.length - 1 ? (
                // Item atual - apenas texto, sem link
                <span className="breadcrumb-current">{item.label}</span>
              ) : (
                // Itens anteriores - com link clicável
                <button 
                  onClick={() => navigate(item.path)}
                  className="breadcrumb-link"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* <div className="products-header">
          <div className="header-content">
            <h1>{getPageTitle()}</h1>
            {currentCategory ? (
              <p>Produtos da categoria: <strong>{currentCategory.name}</strong></p>
            ) : (
              <p>Explore nossa coleção completa de moldes</p>
            )}
          </div>
          
          <div className="header-stats">
            <span>{filteredProducts.length} produto(s) encontrado(s)</span>
          </div>
        </div> */}

        <div className="products-content">
          {/* Sidebar com filtros */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Categorias</h3>
              <ul className="category-list">
                <li>
                  <button
                    className={`category-btn ${!currentCategory ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(null)}
                  >
                    Todas as Categorias ({allProducts.length})
                  </button>
                </li>
                {categories.map(category => {
                  const categoryCount = allProducts.filter(p => p.categoryId === category.id).length;
                  return (
                    <li key={category.id}>
                      <button
                        className={`category-btn ${currentCategory?.id === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category.id!)}
                      >
                        {category.name} ({categoryCount})
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="filter-section">
              <h3>Ordenar por</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'newest')}
                className="sort-select"
              >
                <option value="name">Nome A-Z</option>
                <option value="price">Menor Preço</option>
                <option value="newest">Mais Recentes</option>
              </select>
            </div>

            <div className="filter-section">
              <h3>Faixa de Preço</h3>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))
                  }
                />
                <span>até</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
          </aside>

          {/* Grade de produtos */}
          <main className="products-main">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou explorar outras categorias.</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setPriceRange({ min: 0, max: 1000 });
                    setSortBy('name');
                    handleCategoryChange(null);
                  }}
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;