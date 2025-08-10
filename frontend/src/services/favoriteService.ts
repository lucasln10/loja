import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/user/favorites';

export const favoriteService = {
  async getFavorites(): Promise<Set<number>> {
    const res = await axios.get<number[]>(API_BASE);
    return new Set(res.data || []);
  },

  async addFavorite(productId: number): Promise<void> {
    await axios.post(`${API_BASE}/${productId}`);
  },

  async removeFavorite(productId: number): Promise<void> {
    await axios.delete(`${API_BASE}/${productId}`);
  },
};
