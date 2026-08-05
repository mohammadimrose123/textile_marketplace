import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCpu, FiMic, FiSearch, FiVolume2, FiZap } from "react-icons/fi";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    "Cotton under $20",
    "Organic Linen",
    "Blue Denim",
    "Silk for Dresses",
    "Polyester Rolls",
  ];

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is supported in Chrome, Edge, and Safari browsers.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      navigate(`/ai?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/ai?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 rounded-[2rem] bg-slate-950 p-8 border border-slate-800 shadow-2xl sm:grid-cols-[1.4fr_1fr] sm:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 border border-blue-400/20">
              <FiCpu className="text-blue-400" />
              AI Voice & Text Sourcing Engine
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Search products using Voice or AI Chat
              </h2>
              <p className="mt-4 max-w-xl text-slate-300">
                Speak or type exactly what you need to get instant, relevant textile supplier results from our live marketplace.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="rounded-3xl bg-slate-900 p-4 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-800 px-4 py-3 border border-slate-700">
                <FiSearch className="text-xl text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Speak or type: 'Show me white cotton fabric under $20'"
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />

                {/* Voice Mic Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-2.5 rounded-xl transition ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                  }`}
                  title={isListening ? "Listening... Speak now" : "Click to speak using Voice AI"}
                >
                  <FiMic className="text-lg" />
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Search AI
                </button>
              </div>

              {isListening && (
                <div className="mt-2 text-center text-xs font-semibold text-rose-400 animate-pulse flex items-center justify-center gap-1">
                  <FiVolume2 className="text-base" /> Listening to your voice... Speak your fabric requirements now.
                </div>
              )}
            </form>
          </div>

          <div className="space-y-4 rounded-[2rem] bg-slate-900 p-6 text-slate-200 border border-slate-800">
            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-bold">Voice AI Assistant</p>
              <h3 className="mt-2 text-xl font-semibold">Built for sourcing teams</h3>
              <p className="mt-2 text-xs text-slate-400">
                Smart voice recognition with buyer intent understanding and direct MongoDB catalog search.
              </p>
            </div>

            <div className="grid gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(`/ai?q=${encodeURIComponent(item)}`)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-xs text-slate-300 transition hover:border-blue-500 hover:text-white flex justify-between items-center"
                >
                  <span>{item}</span>
                  <FiZap className="text-blue-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
