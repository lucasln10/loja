import { CarouselItem } from '../types';
import { API_BASE_URL } from './productService';

const normalizeCarouselImageUrl = (url: string): string => {
  if (!url) return '/images/logo.webp';
  let fixed = url.trim();
  fixed = fixed.replace('/uploads/product/', '/uploads/products/');
  fixed = fixed.replace('uploads/product/', 'uploads/products/');
  const lastSlash = fixed.lastIndexOf('/')
  const filename = lastSlash >= 0 ? fixed.substring(lastSlash + 1) : fixed;
  if (fixed.includes('/uploads/products/')) {
    return `${API_BASE_URL}/api/products/images/${filename}`;
  }
  if (fixed.includes('/api/products/images/')) {
    return fixed.startsWith('http') ? fixed : `${API_BASE_URL}${fixed.startsWith('/') ? fixed : '/' + fixed}`;
  }
  if (!fixed.startsWith('http') && !fixed.startsWith('/')) fixed = `/${fixed}`;
  if (!fixed.startsWith('http')) fixed = `${API_BASE_URL}${fixed}`;
  return fixed;
};

class CarouselService {
  async getActiveCarouselItems(): Promise<CarouselItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/active`);
      if (response.ok) {
        const items: CarouselItem[] = await response.json();
        return items.map(item => ({
          ...item,
          imageUrl: normalizeCarouselImageUrl(item.imageUrl)
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar itens do carrossel:', error);
      return [];
    }
  }

  async getAllCarouselItems(authToken: string): Promise<CarouselItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/admin`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const items: CarouselItem[] = await response.json();
        return items.map(item => ({
          ...item,
          imageUrl: normalizeCarouselImageUrl(item.imageUrl)
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar todos os itens do carrossel:', error);
      return [];
    }
  }

  async addProductToCarousel(productId: number, displayOrder: number, authToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/add-product/${productId}?displayOrder=${displayOrder}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao adicionar produto ao carrossel: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrossel:', error);
      throw error;
    }
  }
  async addCustomToCarousel(
    imageFile: File,
    title: string,
    description: string,
    linkUrl: string,
    displayOrder: number,
    authToken: string
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('linkUrl', linkUrl);
      formData.append('displayOrder', displayOrder.toString());

      const response = await fetch(`${API_BASE_URL}/api/carousel/add-custom`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao adicionar imagem personalizada ao carrossel: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar imagem personalizada ao carrossel:', error);
      throw error;
    }
  }

  async removeCarouselItem(id: number, authToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao remover item do carrossel: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao remover item do carrossel:', error);
      throw error;
    }
  }

  async toggleCarouselItem(id: number, authToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao alterar status do item: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao alterar status do item:', error);
      throw error;
    }
  }
}

export const carouselService = new CarouselService();
