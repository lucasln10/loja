import { Product } from '../types';
import { categoryService } from './categoryService';

export const API_BASE_URL = 'http://localhost:8080';

export interface ProductDTO {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  categoryId: number;
  categoryIds?: number[]; // Adicionando suporte para múltiplas categorias
  imageUrl?: string;
  imageUrls?: string[];
  status?: boolean;
}
const toAbsoluteUrl = (url: string): string => {
  if (!url) return '/images/logo.webp';
  let fixed = url.trim();
  fixed = fixed.replace('/uploads/product/', '/uploads/products/');
  fixed = fixed.replace('uploads/product/', 'uploads/products/');
  if (fixed.endsWith('/uploads/product')) fixed = fixed.replace('/uploads/product', '/uploads/products');
  if (fixed.includes('uploads/product')) fixed = fixed.replace('uploads/product', 'uploads/products');

  if (fixed.startsWith('http://') || fixed.startsWith('https://')) return fixed;
  const path = fixed.startsWith('/') ? fixed : `/${fixed}`;
  return `${API_BASE_URL}${path}`;
};
const getProductImage = (dto: ProductDTO): string => {
  console.log('🖼️ Mapeando imagem para produto:', dto.name, {
    imageUrl: dto.imageUrl,
    imageUrls: dto.imageUrls
  });
  if (dto.imageUrls && dto.imageUrls.length > 0) {
    const url = toAbsoluteUrl(dto.imageUrls[0]);
    console.log('✅ Usando imageUrls[0]:', url);
    return url;
  }
  
  if (dto.imageUrl) {
    const url = toAbsoluteUrl(dto.imageUrl);
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
      // Mantém o mapeamento básico; a versão com categorias corrige o nome depois
      return filtered.map(dto => ({
        id: dto.id || 0,
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        category: 'Produto', // será substituído em getAllProductsWithCategories
        categoryId: dto.categoryId,
        categoryIds: dto.categoryIds, // Adicionando suporte para múltiplas categorias
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
      const [products, categories] = await Promise.all([
        this.getAllProducts(),
        categoryService.getAllCategories(),
      ]);

      const categoryMap = new Map<number, string>(
        categories
          .filter(c => typeof c.id === 'number')
          .map(c => [c.id as number, c.name])
      );
      
      return products.map(p => {
        // Se tiver múltiplas categorias, mostrar todas
        if (p.categoryIds && p.categoryIds.length > 0) {
          const categoryNames = p.categoryIds
            .map(id => categoryMap.get(id))
            .filter(name => name !== undefined)
            .join(', ');
          
          return {
            ...p,
            category: categoryNames || 'Produto'
          };
        }
        
        // Se não tiver múltiplas categorias, usar a categoria principal
        return {
          ...p,
          category: categoryMap.get(p.categoryId || 0) || 'Produto'
        };
      });
    } catch (error) {
      console.error('Erro ao buscar produtos com categorias:', error);
      return [];
    }
  },
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      console.log('Buscando produtos em destaque...');
      const products = await this.getAllProductsWithCategories();
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
      
      // Se tiver múltiplas categorias, mostrar todas
      if (dto.categoryIds && dto.categoryIds.length > 0) {
        try {
          const categories = await categoryService.getAllCategories();
          const categoryNames = dto.categoryIds
            .map(id => {
              const category = categories.find(c => c.id === id);
              return category ? category.name : null;
            })
            .filter(name => name !== null)
            .join(', ');
          
          return {
            id: dto.id || 0,
            name: dto.name,
            price: dto.price,
            image: getProductImage(dto),
            description: dto.description || '',
            category: categoryNames || 'Produto',
            categoryId: dto.categoryId,
            categoryIds: dto.categoryIds,
            quantity: dto.quantity
          };
        } catch {
          console.log('❌ Erro ao buscar categorias, usando fallback "Produto"');
        }
      }
      
      // Se não tiver múltiplas categorias, usar a categoria principal
      let categoryName = 'Produto';
      try {
        const categories = await categoryService.getAllCategories();
        const found = categories.find(c => c.id === dto.categoryId);
        if (found?.name) categoryName = found.name;
      } catch {
        console.log('❌ Erro ao buscar categoria, usando fallback "Produto"');
      }

      return {
        id: dto.id || 0,
        name: dto.name,
        price: dto.price,
        image: getProductImage(dto),
        description: dto.description || '',
        category: categoryName,
        categoryId: dto.categoryId,
        categoryIds: dto.categoryIds,
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
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/images/product/${productId}`);
        if (response.ok) {
          const imageUrls: string[] = await response.json();
          const fullUrls = imageUrls.map(url => toAbsoluteUrl(url));
          console.log('✅ Imagens encontradas no endpoint específico:', fullUrls);
          return fullUrls.length > 0 ? fullUrls : ['/images/logo.webp'];
        }
      } catch (err) {
        console.log('⚠️ Endpoint específico de imagens não disponível, tentando pelo produto...');
      }
      const productResponse = await fetch(`${API_BASE_URL}/api/products/${productId}`);
      if (productResponse.ok) {
        const product: ProductDTO = await productResponse.json();
        console.log('📦 Produto para extração de imagens:', product);
        
        const images: string[] = [];
        
        if (product.imageUrls && product.imageUrls.length > 0) {
          product.imageUrls.forEach(url => {
            images.push(toAbsoluteUrl(url));
          });
        }
        
        if (product.imageUrl) {
          const url = toAbsoluteUrl(product.imageUrl);
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
