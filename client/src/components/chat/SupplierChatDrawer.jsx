import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiMessageSquare } from "react-icons/fi";
import API from "../../services/api";

export default function SupplierChatDrawer({ isOpen, onClose, supplierName = "Apex Eco-Textiles Co." }) {
  const [messages, setMessages] = useState([
    {
      id: "init",
      senderRole: "Supplier",
      text: `Hello! Welcome to ${supplierName}. How can we assist you with your bulk fabric order today?`,
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchChat = async () => {
      try {
        const response = await API.get("/chat");
        if (response.data && response.data.length > 0) {
          setMessages((prev) => [prev[0], ...response.data]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChat();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const textToSend = input;
    setInput("");

    const newMsg = {
      _id: `msg_${Date.now()}`,
      senderRole: "Buyer",
      text: textToSend,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await API.post("/chat", { text: textToSend, supplierName });
    } catch (err) {
      console.error("Chat post error:", err);
    }

    // Auto supplier response simulation
    setTimeout(() => {
      const supplierReply = {
        _id: `reply_${Date.now()}`,
        senderRole: "Supplier",
        text: "Thank you for reaching out! Our sales manager will verify your MOQ requirements and send a customized quote shortly.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, supplierReply]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Chat Header */}
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
                  <FiMessageSquare />
                </div>
                <div>
                  <h3 className="font-bold text-base line-clamp-1">{supplierName}</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online • MongoDB Chat API Active
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg, idx) => {
                const isBuyer = msg.senderRole === "Buyer" || msg.sender === "user";
                const dateVal = msg.createdAt ? new Date(msg.createdAt) : new Date();
                const timeStr = dateVal.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={msg._id || msg.id || idx}
                    className={`flex flex-col ${isBuyer ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        isBuyer
                          ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{timeStr}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inquire about GSM, MOQ, or bulk pricing..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition shadow-md shadow-blue-600/20 flex items-center justify-center"
              >
                <FiSend className="text-base" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
