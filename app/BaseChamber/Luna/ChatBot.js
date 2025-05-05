"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Dropdown = ({ modelName, setModelName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        width: "200px",
        zIndex: 1000, // Ensure it is on top of other elements
      }}
    >
      <button
        onClick={toggleDropdown}
        style={{
          color: "white",
          padding: "10px",
          backdropFilter: "blur(50px)",
          backgroundColor: "transparent", // Platinum background color
          borderRadius: "50px",
          boxShadow: "0 4px 8px #e5e4e2",
          width: "100%",
          border: "none",
          cursor: "pointer",
          transition: "all 0.4s ease",
        }}
      >
        {modelName}
      </button>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{
            listStyleType: "none",
            padding: "0",
            margin: "10px 0 0 0",
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            backdropFilter: "blur(50px)",
            backgroundColor: "transparent", // Platinum background color
            borderRadius: "12px",
            boxShadow: "0 4px 8px #e5e4e2",
            zIndex: 10,
            color: "white",
          }}
        >
          <li
            style={{
              padding: "10px",
              cursor: "pointer",
              color: modelName !== "Luna SLM v1.0" ? "#999" : "wheat",

              borderRadius: "12px",
              transition: "all 0.3s ease",
            }}
            onClick={() => setModelName("Luna SLM v1.0")}
          >
            Luna SLM v1.0
          </li>
          <li
            style={{
              padding: "10px",
              cursor: "pointer",
              color: modelName !== "Gemini v1.0 pro" ? "#999" : "wheat",
              borderRadius: "12px",
              transition: "all 0.3s ease",
            }}
            onClick={() => setModelName("Gemini v1.0 pro")}
          >
            Gemini v1.0 pro
          </li>
        </motion.ul>
      )}
    </motion.div>
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const [modelName, setModelName] = useState("Luna SLM v1.0");

  const handleChange = (e) => {
    setValue(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const sendMessage = async () => {
    if (value.trim() === "") return;
    const userMessage = { sender: "user", text: value };
    setMessages([...messages, userMessage]);
    setValue("");

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: userMessage.text,
        model: modelName,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error processing request." },
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        alignItems: "center",
        position: "relative", // Needed to prevent overlapping with dropdown
        marginTop: "15px", // Add some top margin to make space for dropdown
      }}
    >
      <div style={{ position: "absolute", top: "0px", right: "0px" }}>
        <Dropdown setModelName={setModelName} modelName={modelName} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          width: "700px",
          height: "600px",
          backgroundColor: "#e3daf5",
          borderRadius: "20px",
          padding: "10px",
          opacity: "0.8",
          overflowY: "auto",
        }}
      >
        <div style={{ maxHeight: "500px", overflowY: "auto", padding: "10px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "10px 0",
              }}
            >
              <p
                style={{
                  backgroundColor:
                    msg.sender === "user" ? "#bbb5c7" : "#0b011f",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  display: "inline-block",
                }}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder="Type your message..."
            style={{
              flex: 1,
              borderRadius: "10px",
              padding: "10px",
              resize: "none",
              boxShadow: "3px 3px 5px #666",
            }}
          />
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "sandybrown",
            }}
            onClick={sendMessage}
            style={{
              padding: "10px 15px",
              borderRadius: "20px",
              backgroundColor: "seashell",
              fontSize: "30px",
              boxShadow: "3px 3px 5px #666",
            }}
          >
            ➤
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
