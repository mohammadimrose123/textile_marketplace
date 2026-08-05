import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight, FiPrinter } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItemsCount,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const itemsHTML = cartItems
      .map(
        (item, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: bold; color: #1e293b;">${idx + 1}. ${item.product.title}</td>
          <td style="padding: 12px; color: #475569;">${item.product.category || "Cotton"}</td>
          <td style="padding: 12px; text-align: center; color: #1e293b; font-weight: bold;">${item.quantity} yds</td>
          <td style="padding: 12px; text-align: right; color: #475569;">$${item.product.price}</td>
          <td style="padding: 12px; text-align: right; font-weight: bold; color: #2563eb;">$${(item.product.price * item.quantity).toLocaleString()}</td>
        </tr>
      `
      )
      .join("");

    const documentHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FabricFlow AI - Purchase Order Statement</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 40px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: bold; color: #2563eb; }
            .po-info { text-align: right; font-size: 14px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background-color: #f1f5f9; padding: 12px; text-align: left; font-size: 13px; color: #334155; }
            .total-row { border-top: 2px solid #0f172a; font-size: 16px; font-weight: bold; }
            .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">FabricFlow AI</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Global B2B Textile Sourcing Platform</div>
            </div>
            <div class="po-info">
              <div><strong>PURCHASE ORDER QUOTE</strong></div>
              <div>Date: ${dateStr}</div>
              <div>PO ID: PO-${Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fabric Item</th>
                <th>Category</th>
                <th style="text-align: center;">Yardage Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Subtotal Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr class="total-row">
                <td colspan="3" style="padding: 16px 12px;">Total Sourcing Quantity: ${totalItemsCount} Yards</td>
                <td style="padding: 16px 12px; text-align: right;">Total Quote:</td>
                <td style="padding: 16px 12px; text-align: right; color: #2563eb;">$${totalPrice.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Generated via FabricFlow AI Platform • Official Quotation Document for Buyers & Suppliers
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(documentHTML);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
                  <FiShoppingBag />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Sourcing Cart</h2>
                  <p className="text-xs text-slate-400">{totalItemsCount} Yards selected</p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <FiShoppingBag className="text-5xl text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-800">Your cart is empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Browse the marketplace and click "Add to Cart" on any fabric listing.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product._id || item.product.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {item.product.category ? item.product.category[0] : "F"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          ${item.product.price} / yard • {item.color}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id || item.product.id,
                              item.quantity - 50
                            )
                          }
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-slate-800">{item.quantity} yds</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id || item.product.id,
                              item.quantity + 50
                            )
                          }
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id || item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Remove item"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Yards</span>
                    <span className="font-semibold text-slate-900">{totalItemsCount} yds</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-200">
                    <span>Total Subtotal</span>
                    <span className="text-blue-600">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-2xl transition flex items-center justify-center gap-1.5 text-xs"
                    title="Export Purchase Order PDF Statement"
                  >
                    <FiPrinter className="text-base" />
                    <span>Export PO</span>
                  </button>

                  <button
                    onClick={() => {
                      alert("Purchase Order inquiry submitted successfully!");
                      clearCart();
                      setIsCartOpen(false);
                    }}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Request Supplier Quote</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
