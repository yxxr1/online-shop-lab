export interface CartItem {
  productId: string;
  quantity: number;
}

export interface UserCart {
  id: string;
  cart: CartItem[];
}
