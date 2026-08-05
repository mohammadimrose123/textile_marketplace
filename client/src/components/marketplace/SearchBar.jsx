import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiSearch, FiVolume2 } from "react-icons/fi";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is supported in Chrome, Edge, and Safari browsers. Please ensure microphone access is allowed.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        if (onSearch) {
          onSearch(transcript);
        } else {
          navigate(`/ai?q=${encodeURIComponent(transcript)}`);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          alert("Microphone access was denied. Please allow microphone permission in your browser settings.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Voice search initialization error:", err);
      setIsListening(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/ai?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search fabrics, GSM, suppliers, or speak with Voice Search..."
          />
        </div>

        <div className="flex gap-2">
          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
            }`}
          >
            <FiMic className="mr-2 text-base" />
            <span>{isListening ? "Listening..." : "Voice Search"}</span>
          </button>
        </div>
      </form>

      {isListening && (
        <div className="mt-3 text-center text-xs font-semibold text-rose-500 animate-pulse flex items-center justify-center gap-1.5">
          <FiVolume2 className="text-sm" /> Speak your fabric request now (e.g., "Cotton fabric under $20")
        </div>
      )}
    </div>
  );
}
