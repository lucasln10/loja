import { Product } from '../types';

export const API_BASE_URL = 'http://localhost:8080';

export interface SearchParams {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  inStock?: boolean;
  page?: number;
  size?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  activeOnly?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductDTO {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  categoryId: number;
  imageUrl?: string;
  imageUrls?: string[];
  status?: boolean;
}

// Função para converter ProductDTO para Product
const mapProductDTOToProduct = (dto: ProductDTO): Product => {
  // Prioridade: imageUrls[0] > imageUrl > logo padrão
  let imageUrl = '/images/logo.webp';
  
  if (dto.imageUrls && dto.imageUrls.length > 0) {
    imageUrl = dto.imageUrls[0].startsWith('http') 
      ? dto.imageUrls[0] 
      : `${API_BASE_URL}${dto.imageUrls[0]}`;
  } else if (dto.imageUrl) {
    imageUrl = dto.imageUrl.startsWith('http') 
      ? dto.imageUrl 
      : `${API_BASE_URL}${dto.imageUrl}`;
  }

  return {
    id: dto.id || 0,
    name: dto.name,
    price: dto.price,
    quantity: dto.quantity,
    description: dto.description,
    categoryId: dto.categoryId,
    image: imageUrl,
    imageUrl: dto.imageUrl,
    imageUrls: dto.imageUrls,
    status: dto.status,
    category: 'Produto'
  };
};

export const searchService = {
  // Busca avançada com filtros
  async searchProducts(params: SearchParams): Promise<PageResponse<Product>> {
    try {
      console.log('🔍 Realizando busca avançada:', params);
      
      const response = await fetch(`${API_BASE_URL}/api/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: params.searchTerm || '',
          categoryId: params.categoryId,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          minStock: params.minStock,
          maxStock: params.maxStock,
          inStock: params.inStock,
          page: params.page || 0,
          size: params.size || 20,
          sortBy: params.sortBy || 'name',
          sortDirection: params.sortDirection || 'asc',
          activeOnly: params.activeOnly !== false // default true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PageResponse<ProductDTO> = await response.json();
      console.log('✅ Busca realizada com sucesso:', data);

      return {
        ...data,
        content: data.content.map(mapProductDTOToProduct)
      };
    } catch (error) {
      console.error('❌ Erro na busca avançada:', error);
      return {
        content: [],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      };
    }
  },

  // Busca simples por termo
  async searchByTerm(term: string, page: number = 0, size: number = 20): Promise<PageResponse<Product>> {
    try {
      console.log('🔍 Realizando busca simples:', { term, page, size });
      
      const response = await fetch(
        `${API_BASE_URL}/api/products/search?q=${encodeURIComponent(term)}&page=${page}&size=${size}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PageResponse<ProductDTO> = await response.json();
      console.log('✅ Busca simples realizada com sucesso:', data);

      return {
        ...data,
        content: data.content.map(mapProductDTOToProduct)
      };
    } catch (error) {
      console.error('❌ Erro na busca simples:', error);
      return {
        content: [],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      };
    }
  },

  // Busca por categoria
  async searchByCategory(categoryId: number, page: number = 0, size: number = 20): Promise<PageResponse<Product>> {
    try {
      console.log('🔍 Buscando por categoria:', { categoryId, page, size });
      
      const response = await fetch(
        `${API_BASE_URL}/api/products/category/${categoryId}?page=${page}&size=${size}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PageResponse<ProductDTO> = await response.json();
      console.log('✅ Busca por categoria realizada com sucesso:', data);

      return {
        ...data,
        content: data.content.map(mapProductDTOToProduct)
      };
    } catch (error) {
      console.error('❌ Erro na busca por categoria:', error);
      return {
        content: [],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      };
    }
  },

  // Busca por faixa de preço
  async searchByPriceRange(
    minPrice?: number, 
    maxPrice?: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<PageResponse<Product>> {
    try {
      console.log('🔍 Buscando por faixa de preço:', { minPrice, maxPrice, page, size });
      
      const params = new URLSearchParams();
      if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
      if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
      params.append('page', page.toString());
      params.append('size', size.toString());

      const response = await fetch(`${API_BASE_URL}/api/products/price-range?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PageResponse<ProductDTO> = await response.json();
      console.log('✅ Busca por preço realizada com sucesso:', data);

      return {
        ...data,
        content: data.content.map(mapProductDTOToProduct)
      };
    } catch (error) {
      console.error('❌ Erro na busca por preço:', error);
      return {
        content: [],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      };
    }
  }
};
