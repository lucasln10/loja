import { Product } from '../types';

export const API_BASE_URL = 'http://localhost:8080';

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

// Função para obter a imagem do produto
const getProductImage = (dto: ProductDTO): string => {
  console.log('🖼️ Mapeando imagem para produto:', dto.name, {
    imageUrl: dto.imageUrl,
    imageUrls: dto.imageUrls
  });

  // Prioridade: imageUrls[0] > imageUrl > logo padrão
  if (dto.imageUrls && dto.imageUrls.length > 0) {
    const url = dto.imageUrls[0].startsWith('http') 
      ? dto.imageUrls[0] 
      : `${API_BASE_URL}${dto.imageUrls[0]}`;
    console.log('✅ Usando imageUrls[0]:', url);
    return url;
  }
  
  if (dto.imageUrl) {
    const url = dto.imageUrl.startsWith('http') 
      ? dto.imageUrl 
      : `${API_BASE_URL}${dto.imageUrl}`;
    console.log('✅ Usando imageUrl:', url);
    return url;
  }
  
  console.log('⚠️ Usando imagem padrão');
  return '/images/logo.webp';
};

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('🔍 Buscando produtos...');
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const all: ProductDTO[] = await response.json();
      console.log('📦 Produtos recebidos:', all);
      const filtered = all.filter(p => p.status === true || p.status === undefined);
      console.log('📦 Produtos filtrados:', filtered);
      return filtered.map(dto => ({
        id: dto.id || 0,
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        category: 'Produto',
        categoryId: dto.categoryId,
        quantity: dto.quantity
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return [];
    }
  },

  async getAllProductsWithCategories(): Promise<Product[]> {
    try {
      console.log('Buscando produtos com categorias...');
      return this.getAllProducts();
    } catch (error) {
      console.error('Erro ao buscar produtos com categorias:', error);
      return [];
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      console.log('Buscando produtos em destaque...');
      const products = await this.getAllProducts();
      return products.slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }
  },

  async getProductById(id: number): Promise<Product> {
    try {
      console.log('🔍 Buscando produto por ID:', id);
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const dto: ProductDTO = await response.json();
      console.log('📦 Produto recebido:', dto);
      return {
        id: dto.id || 0,
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        category: 'Produto',
        categoryId: dto.categoryId,
        quantity: dto.quantity
      };
    } catch (error) {
      console.error('❌ Erro ao buscar produto por ID:', error);
      throw error;
    }
  },

  async getProductImages(productId: number): Promise<string[]> {
    try {
      console.log('🖼️ Buscando imagens do produto:', productId);
      
      // Primeiro tenta buscar do endpoint específico de imagens
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/images/product/${productId}`);
        if (response.ok) {
          const imageUrls: string[] = await response.json();
          const fullUrls = imageUrls.map(url => 
            url.startsWith('http') ? url : `${API_BASE_URL}${url}`
          );
          console.log('✅ Imagens encontradas no endpoint específico:', fullUrls);
          return fullUrls.length > 0 ? fullUrls : ['/images/logo.webp'];
        }
      } catch (err) {
        console.log('⚠️ Endpoint específico de imagens não disponível, tentando pelo produto...');
      }
      
      // Fallback: busca o produto completo e extrai as imagens
      const productResponse = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      if (productResponse.ok) {
        const product: ProductDTO = await productResponse.json();
        console.log('📦 Produto para extração de imagens:', product);
        
        const images: string[] = [];
        
        if (product.imageUrls && product.imageUrls.length > 0) {
          product.imageUrls.forEach(url => {
            images.push(url.startsWith('http') ? url : `${API_BASE_URL}${url}`);
          });
        }
        
        if (product.imageUrl) {
          const url = product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL}${product.imageUrl}`;
          if (!images.includes(url)) {
            images.push(url);
          }
        }
        
        console.log('✅ Imagens extraídas do produto:', images);
        return images.length > 0 ? images : ['/images/logo.webp'];
      }
      
      console.log('⚠️ Usando imagem padrão');
      return ['/images/logo.webp'];
    } catch (error) {
      console.error('❌ Erro ao buscar imagens:', error);
      return ['/images/logo.webp'];
    }
  }
};
