import { CarouselItem } from '../types';

const API_BASE_URL = 'http://localhost:8080';

class CarouselService {
  // Buscar itens ativos do carrossel (público)
  async getActiveCarouselItems(): Promise<CarouselItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/active`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar itens do carrossel:', error);
      return [];
    }
  }

  // Buscar todos os itens (admin)
  async getAllCarouselItems(authToken: string): Promise<CarouselItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel/admin`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar todos os itens do carrossel:', error);
      return [];
    }
  }

  // Adicionar produto ao carrossel
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

  // Adicionar imagem personalizada ao carrossel
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

  // Remover item do carrossel
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

  // Ativar/desativar item
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
