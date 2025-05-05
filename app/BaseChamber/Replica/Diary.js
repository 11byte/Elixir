"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Install axios if you haven't

const Diary = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const diaryPages = [
    { question: "What made you smile today?" },
    { question: "Describe a challenge you faced and how you handled it." },
    { question: "What are you grateful for today?" },
    { question: "What is something you learned today?" },
    { question: "Describe your mood today in one sentence." },
    { question: "If you could relive a moment from today, what would it be?" },
  ];

  const [responses, setResponses] = useState(Array(diaryPages.length).fill(""));

  const handleInputChange = (e) => {
    const updatedResponses = [...responses];
    updatedResponses[currentPage] = e.target.value;
    setResponses(updatedResponses);
  };

  const paginate = (newDirection) => {
    if (newDirection === 1 && currentPage <= diaryPages.length) {
      setCurrentPage(currentPage + 1);
    } else if (newDirection === -1 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  const todayDate = `${day}${getOrdinalSuffix(day)} ${month} ${year}`;

  const handleSubmit = async () => {
    try {
      const diaryData = {
        date: todayDate,
        entries: diaryPages.map((page, index) => ({
          question: page.question,
          response: responses[index] || "",
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/submit-diary",
        diaryData
      );
      if (res.status === 200) {
        alert("Diary submitted successfully!");
        // Reset
        setCurrentPage(0);
        setResponses(Array(diaryPages.length).fill(""));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit diary.");
    }
  };

  const direction = 1;

  return (
    <div className="relative w-full bg-[#f0e6d2] p-6 rounded-2xl shadow-2xl text-center overflow-hidden min-h-[450px] perspective-1000 font-comic italic">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={{
            initial: (dir) => ({
              rotateY: dir > 0 ? -90 : 90,
              opacity: 0,
              originX: dir > 0 ? 1 : 0,
              scale: 0.95,
            }),
            animate: {
              rotateY: 0,
              opacity: 1,
              originX: 0.5,
              scale: 1,
              transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] },
            },
            exit: (dir) => ({
              rotateY: dir > 0 ? 90 : -90,
              opacity: 0,
              originX: dir > 0 ? 0 : 1,
              scale: 0.95,
              transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] },
            }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute w-full h-full top-0 left-0 bg-[#fff8e1] p-10 rounded-xl shadow-lg flex flex-col items-center"
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Date */}
          <div
            className="w-full text-right text-sm text-gray-600 mb-4"
            style={{ fontFamily: "Comic Sans MS" }}
          >
            {todayDate}
          </div>

          {/* Question */}
          {currentPage === 6 ? (
            <h1
              className="text-5xl italic mb-8"
              style={{
                transform: "rotate(-10deg)",
                fontFamily: "Comic Sans MS",
              }}
            >
              <div>Submit</div>
              <div>Today's</div>
              <div>Diary</div>
            </h1>
          ) : (
            <h2
              className="text-2xl font-bold mb-4 text-gray-800"
              style={{ fontFamily: "Comic Sans MS" }}
            >
              {diaryPages[currentPage].question}
            </h2>
          )}

          {/* Input Area */}
          {currentPage === 6 ? (
            <button
              onClick={handleSubmit}
              className="w-24 rounded-xl text-center text-blue-950 p-3 border border-yellow-950 duration-300 hover:bg-amber-200 hover:w-44 transition-all ease-in-out"
            >
              Submit
            </button>
          ) : (
            <textarea
              value={responses[currentPage]}
              onChange={handleInputChange}
              placeholder="Write your thoughts here..."
              className="w-full flex-1 bg-transparent border-none focus:outline-none resize-none text-lg text-gray-700 italic placeholder:text-gray-400"
              style={{
                minHeight: "300px",
                lineHeight: "1.8",
                fontFamily: "Comic Sans MS, cursive, sans-serif",
                backgroundImage:
                  "linear-gradient(to bottom, transparent 95%, rgba(0,0,0,0.1) 95%)",
                backgroundSize: "100% 2.5em",
                backgroundRepeat: "repeat-y",
              }}
            />
          )}

          {/* Page Number */}
          <div className="w-full text-center text-sm text-gray-600 mb-4 italic absolute left-[20px] bottom-[-10px]">
            {currentPage + 1}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        disabled={currentPage === 0}
        className="bg-[#fff8e1] text-blue-800 px-2 py-2 rounded-lg shadow-md hover:bg-yellow-100 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          fontFamily: "Comic Sans MS",
          position: "absolute",
          fontSize: "20px",
          top: "50%",
          left: "0px",
        }}
      >
        ⇤
      </button>
      <button
        onClick={() => paginate(1)}
        disabled={currentPage === 6}
        className="bg-[#fff8e1] text-blue-800 px-2 py-2 rounded-lg shadow-md hover:bg-yellow-100 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          fontFamily: "Comic Sans MS",
          fontSize: "20px",
          position: "absolute",
          top: "50%",
          right: "0px",
        }}
      >
        ⇥
      </button>
    </div>
  );
};

export default Diary;
