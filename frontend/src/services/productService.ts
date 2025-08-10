import { Product } from '../types';

const API_BASE_URL = 'http://localhost:8080';

// Interface baseada no seu ProductDTO exato
export interface ProductDTO {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  detailedDescription?: string;
  categoryId: number;
  imageUrl?: string;
  imageUrls?: string[];
}

// Interface para categoria
export interface CategoryDTO {
  id: number;
  name: string;
  description?: string;
}

// Função auxiliar para obter a imagem do produto (fora do objeto)
const getProductImage = (dto: ProductDTO): string => {
  // Prioridade: imageUrls[0] > imageUrl > logo como padrão
  if (dto.imageUrls && dto.imageUrls.length > 0) {
    return dto.imageUrls[0].startsWith('http') 
      ? dto.imageUrls[0] 
      : `${API_BASE_URL}${dto.imageUrls[0]}`;
  }
  
  if (dto.imageUrl) {
    return dto.imageUrl.startsWith('http') 
      ? dto.imageUrl 
      : `${API_BASE_URL}${dto.imageUrl}`;
  }
  
  return '/images/logo.webp'; // ✅ Agora usa a logo que você tem
};

export const productService = {
  // Novo método: Buscar produtos com nomes de categorias
  async getAllProductsWithCategories(): Promise<Product[]> {
    try {
      // Buscar produtos e categorias em paralelo
      const [productsDTO, categories] = await Promise.all([
  fetch(`${API_BASE_URL}/api/products/enabled`).then(res => res.json()),
        fetch(`${API_BASE_URL}/api/categories`).then(res => res.json())
      ]);

      // Criar mapa de categorias para busca rápida
      const categoryMap = new Map(categories.map((cat: CategoryDTO) => [cat.id, cat.name]));

      // Converter produtos com nomes de categorias
      return productsDTO.map((dto: ProductDTO) => ({
        id: dto.id || 0,
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        detailedDescription: dto.detailedDescription || '',
        category: categoryMap.get(dto.categoryId) || 'Sem categoria',
        categoryId: dto.categoryId,
        quantity: dto.quantity
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos com categorias:', error);
      throw error;
    }
  },
  async getAllProducts(): Promise<Product[]> {
    try {
      return this.getAllProductsWithCategories();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return this.getAllProductsSimple();
    }
  },
  async getAllProductsSimple(): Promise<Product[]> {
    try {
  const response = await fetch(`${API_BASE_URL}/api/products/enabled`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const productsDTO: ProductDTO[] = await response.json();
      return productsDTO.map(dto => ({
        id: dto.id || 0,
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        detailedDescription: dto.detailedDescription || '',
        category: 'Produto', // Será substituído quando necessário
        categoryId: dto.categoryId, // ✅ Incluir categoryId
        quantity: dto.quantity
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // GET /api/products/{id} - Buscar produto por ID
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Produto não encontrado: ${response.status}`);
      }
      
      const dto: ProductDTO = await response.json();
      
      return {
        id: dto.id || 0, // ✅ Mantém como number
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        detailedDescription: dto.detailedDescription || '',
        category: 'Produto', // Será substituído na página de detalhes
        categoryId: dto.categoryId, // ✅ Incluir categoryId
        quantity: dto.quantity
      };
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  },

  // POST /api/products - Criar produto
  async createProduct(productData: Omit<ProductDTO, 'id'>, authToken?: string): Promise<Product> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar produto: ${response.status}`);
      }
      
      const dto: ProductDTO = await response.json();
      
      return {
        id: dto.id || 0, // ✅ Mantém como number
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        category: 'Produto',
        quantity: dto.quantity
      };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // PUT /api/products/{id} - Atualizar produto
  async updateProduct(id: number, productData: ProductDTO, authToken?: string): Promise<Product> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...productData, id }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar produto: ${response.status}`);
      }
      
      const dto: ProductDTO = await response.json();
      
      return {
        id: dto.id || 0, // ✅ Mantém como number
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        category: 'Produto',
        quantity: dto.quantity
      };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // DELETE /api/products/{id} - Deletar produto (requer autenticação ADMIN)
  async deleteProduct(id: number, authToken?: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao deletar produto: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },

  // Buscar imagens de um produto específico
  async getProductImages(productId: number): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/images/product/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar imagens: ${response.status}`);
      }
      
      const imageUrls: string[] = await response.json();
      const fullUrls = imageUrls.map(url => 
        url.startsWith('http') ? url : `${API_BASE_URL}${url}`
      );
      // Se não houver imagens, retorna a logo como padrão
      return fullUrls.length > 0 ? fullUrls : ['/images/logo.webp'];
    } catch (error) {
      console.error('Erro ao buscar imagens do produto:', error);
      // Em caso de erro, retorna a logo como padrão
      return ['/images/logo.webp'];
    }
  },

  // Métodos auxiliares para o carrossel e produtos em destaque
  async getCarouselProducts(): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      return products.slice(0, 5);
    } catch (error) {
      console.error('Erro ao buscar produtos do carrossel:', error);
      // Retorna array vazio se houver erro
      return [];
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      return products.slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      // Retorna array vazio se houver erro
      return [];
    }
  },

  // Novo método: Buscar produtos por categoria
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      // Se o backend tiver endpoint específico para categoria:
      // const response = await fetch(`${API_BASE_URL}/api/products/category/${categoryId}`);
      
      // Por enquanto, busca todos e filtra no frontend:
      const allProducts = await this.getAllProductsWithCategories();
      return allProducts.filter(product => product.categoryId === categoryId);
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw error;
    }
  },
  async getProductsByCategoryName(categoryName: string): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProductsWithCategories();
      return allProducts.filter(product => 
        product.category && product.category.toLowerCase() === categoryName.toLowerCase()
      );
    } catch (error) {
      console.error('Erro ao buscar produtos por nome da categoria:', error);
      return [];
    }
  },
};