import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiEye, FiStar } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product, onAddToCart }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const prodId = product?._id || product?.id || "1";
  const title = product?.title || product?.name || "Premium Fabric";
  const price = product?.price || 180;
  const image =
    product?.image ||
    product?.images?.[0] ||
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80";

  const isFav = isInWishlist(prodId);

  const handleAdd = (e) => {
    e.stopPropagation();
    const formatProd = {
      _id: prodId,
      title: title,
      price: price,
      category: product?.category || "Cotton",
      images: [image],
    };
    addToCart(formatProd, product?.moq || 100);
    if (onAddToCart) onAddToCart(product);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleWishlist({ _id: prodId, id: prodId, title, price, category: product?.category, image });
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${prodId}`);
  };

  return (
    <div
      onClick={() => navigate(`/product/${prodId}`)}
      className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Fabric Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 select-none">
          <img
            src={image}
            alt={title}
            draggable="false"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 select-none pointer-events-none"
          />

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-md p-2.5 shadow-md transition hover:scale-110"
            title={isFav ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <FiHeart
              className={`text-lg transition ${
                isFav ? "fill-rose-500 text-rose-500" : "text-slate-600 hover:text-rose-500"
              }`}
            />
          </button>

          <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
            ✨ {product?.match || 98}% Match
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700">
              {product?.category || "Cotton"}
            </span>
            <span className="text-xs font-semibold text-slate-500">MOQ: {product?.moq || 100} yds</span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900 transition group-hover:text-blue-600 line-clamp-1">
            {title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 leading-relaxed">
            {product?.description || "High quality textile material with fine thread count suitable for wholesale sourcing."}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <FiStar className="fill-amber-400 text-amber-400 text-sm" />
            <span className="font-bold text-slate-800">{product?.rating || 4.8}</span>
            <span className="text-slate-400">({product?.reviews || 214} Reviews)</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">${price}</p>
              <p className="text-[11px] font-medium text-slate-400">per yard</p>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {product?.stock || 420} yds stock
            </span>
          </div>

          <div className="mt-3 text-xs">
            <span className="text-slate-400">Supplier: </span>
            <span className="font-semibold text-slate-700">{typeof product?.supplier === "object" ? product.supplier.name : (product?.supplier || "ABC Textiles")}</span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          type="button"
          onClick={handleDetailsClick}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FiEye className="text-sm text-slate-500" />
          <span>Details</span>
        </button>

        <button
          type="button"
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20"
        >
          <FiShoppingCart className="text-sm" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
