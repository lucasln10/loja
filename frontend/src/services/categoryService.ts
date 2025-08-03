const API_BASE_URL = 'http://localhost:8080';

// Interface baseada no seu CategoryDTO
export interface CategoryDTO {
  id?: number;
  name: string;
}

export const categoryService = {
  // GET /api/categories - Buscar todas as categorias
  async getAllCategories(): Promise<CategoryDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  // GET /api/categories/{id} - Buscar categoria por ID
  async getCategoryById(id: number): Promise<CategoryDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Categoria não encontrada: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar categoria por ID:', error);
      throw error;
    }
  },

  // POST /api/categories - Criar categoria (requer autenticação ADMIN)
  async createCategory(categoryData: Omit<CategoryDTO, 'id'>, authToken: string): Promise<CategoryDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar categoria: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  // PUT /api/categories/{id} - Atualizar categoria (requer autenticação ADMIN)
  async updateCategory(id: number, categoryData: CategoryDTO, authToken: string): Promise<CategoryDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...categoryData, id }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar categoria: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  // DELETE /api/categories/{id} - Deletar categoria (requer autenticação ADMIN)
  async deleteCategory(id: number, authToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao deletar categoria: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  }
};