import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface CartItem {
  id: string;
  blobId: string;
  caption: string;
  categoryId: string;
  categoryName: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("fde-cart", []);

  const isInCart = useCallback(
    (id: string) => cartItems.some((c) => c.id === id),
    [cartItems],
  );

  const addToCart = useCallback(
    (item: CartItem) => {
      setCartItems((prev) => {
        if (prev.some((c) => c.id === item.id)) return prev;
        return [...prev, item];
      });
    },
    [setCartItems],
  );

  const removeFromCart = useCallback(
    (id: string) => {
      setCartItems((prev) => prev.filter((c) => c.id !== id));
    },
    [setCartItems],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    isInCart,
    count: cartItems.length,
    clearCart,
  };
}
