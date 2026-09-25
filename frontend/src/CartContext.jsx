import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product, size, color, quantity) {
    setItems(prev => [
      ...prev,
      {
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image_url,
        size,
        color,
        quantity
      }
    ]);
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
