import { createContext, useState, useEffect, useContext } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("fabricflow_wishlist");
    return saved ? JSON.parse(saved) : [
      {
        _id: "w1",
        title: "Organic Bamboo Silk",
        price: 28,
        category: "Silk",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      },
      {
        _id: "w2",
        title: "Recycled Polyester Weave",
        price: 14,
        category: "Synthetic",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("fabricflow_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const prodId = product._id || product.id || `w_${Date.now()}`;
    setWishlistItems((prev) => {
      const exists = prev.some((item) => (item._id || item.id) === prodId);
      if (exists) {
        return prev.filter((item) => (item._id || item.id) !== prodId);
      } else {
        return [
          ...prev,
          {
            _id: prodId,
            id: prodId,
            title: product.title || product.name || "Favorite Fabric",
            price: product.price || 20,
            category: product.category || "Cotton",
            image: product.image || product.images?.[0] || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
          },
        ];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
