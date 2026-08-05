import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("fabricflow_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("fabricflow_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = "Natural") => {
    setCartItems((prevItems) => {
      const prodId = product._id || product.id || `p_${Date.now()}`;
      const existingIndex = prevItems.findIndex(
        (item) => (item.product._id || item.product.id) === prodId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += Number(quantity);
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: {
              _id: prodId,
              title: product.title || "Premium Fabric Roll",
              price: product.price || 18.5,
              category: product.category || "Cotton",
              image: product.images?.[0] || product.image || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80",
            },
            quantity: Number(quantity),
            color: color || "Natural",
          },
        ];
      }
    });

    // Try posting to API in background
    try {
      API.post("/cart", { productId: product._id || product.id, quantity, color }).catch(() => {});
    } catch (e) {}

    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.product._id || item.product.id) !== productId)
    );
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.product._id || item.product.id) === productId
          ? { ...item, quantity: Number(newQty) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("fabricflow_cart");
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
