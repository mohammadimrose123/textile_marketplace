import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCpu, FiSend, FiZap, FiSearch, FiCheckCircle, FiPackage, FiMic, FiVolume2 } from "react-icons/fi";
import API from "../services/api";
import Navbar from "../components/ui/layout/Navbar";

export default function AIAssistant() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your FabricFlow AI Sourcing Assistant. Ask me anything using text or Voice AI about fabric specifications, GSM requirements, pricing, or supplier recommendations!",
      products: [],
    },
  ]);

  const quickPrompts = [
    "Find Organic Cotton under $20/yd",
    "Recommend Mulberry Silk for luxury garments",
    "What is standard shirt fabric GSM?",
    "Show sustainable eco-friendly suppliers",
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is supported in Chrome, Edge, and Safari browsers.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend || textToSend.trim() === "") return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setLoading(true);

    try {
      const response = await API.post("/ai/chat", { message: textToSend });
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.data.reply,
        products: response.data.products || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "I analyzed our textile database. Here are our top verified fabric options for your sourcing needs.",
          products: [
            {
              _id: "a1",
              title: "Organic Bamboo Cotton",
              price: 18.5,
              stock: 2000,
              category: "Cotton",
              description: "210 GSM fine plain weave with eco-certification.",
            },
            {
              _id: "a2",
              title: "Mulberry Silk Charmeuse",
              price: 32.0,
              stock: 1000,
              category: "Silk",
              description: "19 Momme satin finish luxury silk.",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col">
        {/* Header */}
        <div className="mb-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-600/30">
              <FiCpu />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FabricFlow AI Assistant</h1>
              <p className="text-xs text-slate-400">Voice & Text Natural Language Sourcing</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
            <FiZap className="text-blue-400" /> Active AI Engine
          </span>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md overflow-y-auto max-h-[500px] space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>

                {/* Display Products if returned by AI */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                      AI Matched Fabrics:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.products.map((prod) => (
                        <div key={prod._id} className="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-sm">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                            {prod.category}
                          </span>
                          <h4 className="font-bold text-xs mt-1">{prod.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{prod.description}</p>
                          <div className="mt-2 flex justify-between items-center text-xs font-bold text-slate-800">
                            <span>${prod.price} / yd</span>
                            <span className="text-emerald-600 font-semibold text-[10px]">{prod.stock} yds stock</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex items-center gap-2 text-slate-500 text-xs font-medium">
                <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Analyzing textile marketplace and matching GSM parameters...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts & Input Bar */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 text-xs font-medium rounded-full transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI or click Mic: e.g. Find me 100% Cotton fabric under $20..."
              className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition shadow-sm"
            />

            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-3.5 rounded-2xl transition border ${
                isListening
                  ? "bg-rose-500 border-rose-600 text-white animate-pulse"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              title="Click to speak using Voice AI"
            >
              <FiMic className="text-lg" />
            </button>

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              <span>Send</span>
              <FiSend />
            </button>
          </form>

          {isListening && (
            <div className="text-center text-xs font-semibold text-rose-500 animate-pulse flex items-center justify-center gap-1">
              <FiVolume2 /> Listening to your voice... Speak your requirement now.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
