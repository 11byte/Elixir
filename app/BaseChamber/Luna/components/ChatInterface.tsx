import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ChatInterface = ({ onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const startChat = async () => {
      try {
        const storedResponses =
          JSON.parse(localStorage.getItem("responses")) || [];
        const response = await axios.post("http://localhost:5000/start");
        const question =
          storedResponses.length < response.data.questions.length
            ? response.data.questions[storedResponses.length]
            : "Assessment complete!";

        setMessages([{ type: "bot", content: question }]);
      } catch (error) {
        setError("Unable to start the chat. Ensure the backend is running.");
      }
    };
    startChat();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    setMessages((prev) => [...prev, { type: "user", content: input }]);
    setInput("");
    setIsTyping(true);

    try {
      const storedResponses =
        JSON.parse(localStorage.getItem("responses")) || [];
      storedResponses.push(input);
      localStorage.setItem("responses", JSON.stringify(storedResponses));

      const response = await axios.post("http://localhost:5000/chat", {
        responses: storedResponses,
      });
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: response.data.question || response.data.response,
          },
        ]);
        setIsTyping(false);

        if (response.data.complete) {
          onComplete(response.data.response);
          localStorage.removeItem("responses");
        }
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setError("Failed to communicate with the server.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isTyping}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
