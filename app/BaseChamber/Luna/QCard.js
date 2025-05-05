"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const QCard = ({ question, index, backgroundImage, totalQuestions }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [choice, setChoice] = useState("");
  // Stores the ML model response

  useEffect(() => {
    console.log("Index passed to QCard:", index);
    const storedAnswers = JSON.parse(localStorage.getItem("answers")) || {};
    if (storedAnswers[index]) {
      setSelectedValue(storedAnswers[index]);
      setChoice(getChoiceText(storedAnswers[index]));
    }
  }, [index]);

  const getChoiceText = (value) => {
    switch (value) {
      case 1:
        return "This is totally not me. 😒";
      case 2:
        return "Doesn’t sound like me. 🤔";
      case 3:
        return "Eh… maybe, depends on the day. 😐";
      case 4:
        return "Yeah, this is me most of the time. 😊";
      case 5:
        return "This describes me perfectly! 🤩";
      default:
        return "";
    }
  };

  const handleResponse = (value) => {
    setSelectedValue(value);
    setChoice(getChoiceText(value));
    const storedAnswers = JSON.parse(localStorage.getItem("answers")) || {};
    if (index !== undefined) {
      storedAnswers[index] = value;
      localStorage.setItem("answers", JSON.stringify(storedAnswers));
    } else {
      console.error("Index is undefined! Cannot save answer.");
    }
  };

  const handleViewAnswers = () => {
    const answers = JSON.parse(localStorage.getItem("answers")) || {};
    console.log("answers: ", answers);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 0.6, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      style={{
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />
      <div
        style={{
          marginBottom: "120px",
          fontSize: "50px",
          color: "aliceblue",
          fontFamily: "Papyrus",
          textAlign: "center",
        }}
      >
        {question}
      </div>
      <div style={{ display: "flex", gap: "15px" }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <lord-icon
            key={value}
            src="https://cdn.lordicon.com/tetzmwxb.json"
            trigger="hover"
            state={selectedValue === value ? "morph-select" : "morph"}
            colors={
              selectedValue === value
                ? "primary:gold,secondary:gold"
                : "primary:silver,secondary:silver"
            }
            style={{ width: "80px", height: "80px", cursor: "pointer" }}
            onClick={() => handleResponse(value)}
          ></lord-icon>
        ))}
      </div>

      {choice && (
        <motion.h5
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: "20px",
            color: "white",
            fontSize: "24px",
            fontFamily: "Times",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {choice}
        </motion.h5>
      )}

      <button
        style={{
          marginTop: "20px",
          padding: "5px",
          fontSize: "40px",
          backgroundColor: "transparent",
          color: "white",
          border: "solid 2px silver",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        👁
      </button>
      <button
        onClick={handleViewAnswers}
        style={{
          color: "gold",
          backdropFilter: "blur(10px)",
          marginTop: "20px",
          padding: "10px",
          fontSize: "20px",
          backgroundColor: "transparent",
          border: "solid 2px gold",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        View Answers
      </button>
    </motion.div>
  );
};

export default QCard;
