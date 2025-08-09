export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  detailedDescription?: string;
  category?: string;
  categoryId?: number;
  image: string;
  imageUrl?: string;
  imageUrls?: string[];
  inStock?: boolean;
}

export interface AdminProduct {
  id?: number;
  name: string;
  description: string;
  detailedDescription?: string;
  price: number;
  quantity: number;
  categoryId: number;
  imageUrl?: string;
  imageUrls?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };