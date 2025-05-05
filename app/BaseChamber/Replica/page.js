"use client";

import Navbar from "../Navbar";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Diary from "./Diary";

export default function Replica() {
  const [genMode, setGenMode] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [prevTab, setPrevTab] = useState("email");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [generatedSubject, setGeneratedSubject] = useState("");
  const [generatedBody, setGeneratedBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/submitEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        body,
        userId: "user123", // Replace with actual user ID
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("Email saved successfully!");
      setSubject("");
      setBody("");
    } else {
      alert("Failed to save email");
    }
  };

  const tabVariants = {
    initial: {
      rotateY: 90,
      opacity: 0,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    exit: {
      rotateY: -90,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const getDirection = () => {
    const tabs = ["email", "diary", "form"];
    return tabs.indexOf(activeTab) > tabs.indexOf(prevTab) ? "left" : "right";
  };

  const generateEmail = async (subject) => {
    try {
      const response = await fetch("http://localhost:5000/api/generateEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject }), // sending the subject to backend
      });

      if (response.ok) {
        const data = await response.json();
        if (data.generatedEmail) {
          // Here you can display the generated email to the user
          console.log("Generated Email:", data.generatedEmail);
          // You can store it in the state or display in UI
          return data.generatedEmail;
        } else {
          console.error("Error: No email generated.");
        }
      } else {
        console.error("Error with API call");
      }
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  const handleGenerateEmail = async () => {
    try {
      setIsLoading(true); // Start loading

      const subjectInput = document.getElementById("subjectInput").value; // Example subject input
      const generatedEmail = await generateEmail(subjectInput);

      console.log("Generated Email Subject:", generatedEmail.subject);
      console.log("Generated Email Body:", generatedEmail.body);

      // Update the frontend directly

      setGeneratedSubject(generatedEmail.subject);
      setGeneratedBody(generatedEmail.body);
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setIsLoading(false); // Always stop loading, even if error happens
    }
  };

  // Call this function on some event like button click

  return (
    <div className="p-0 relative">
      <div className="absolute top-0">
        {" "}
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-[#070b2f] to-[#000000] p-8 flex flex-col items-center text-indigo-300">
        <h1
          className="text-5xl text-indigo-200 mb-8"
          style={{ fontFamily: "Times" }}
        >
          Replica Dashboard
        </h1>

        <div className="flex mb-8">
          {["email", "diary", "form"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 mx-2 rounded-full border transition-all duration-300 capitalize backdrop-blur-md bg-transparent ${
                activeTab === tab
                  ? "border-white text-white"
                  : "border-gray-600 text-gray-600 hover:border-blue-300 hover:text-blue-300"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "email"
                ? "Email Generator"
                : tab === "diary"
                ? "AI Diary"
                : "Auto-Fill Form"}
            </button>
          ))}
        </div>

        <div className="w-full relative max-w-md min-h-[300px]">
          <AnimatePresence mode="wait" custom={getDirection()}>
            {activeTab === "email" && (
              <div>
                <motion.div
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={getDirection()}
                  id="genEmail"
                  className="bg-transparent rounded-lg w-[600px] h-[400px] absolute right-[-500px] border border-blue-100 shadow-[8px_5px_35px_2px_rgba(173,216,230,0.3)] p-3 text-white flex flex-col justify-center items-center"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-pulse text-lg font-semibold mb-2">
                        Generating Email...
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className="w-3 h-3 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></span>
                        <span
                          className="w-3 h-3 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-3 h-3 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 id="subject" className="text-2xl font-bold mb-4">
                        {generatedSubject || "..."}
                      </h3>
                      <p id="body" className="text-md">
                        {generatedBody || "..."}
                      </p>
                    </>
                  )}
                </motion.div>
                <button
                  className="text-xl rounded-full mx-6 bg-transparent px-2 absolute left-[-220px] top-3 text-white"
                  onClick={() => setGenMode(!genMode)}
                  title="Switch modes"
                >
                  ⇆
                </button>
                <motion.form
                  key="email"
                  onSubmit={handleEmailSubmit}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={getDirection()}
                  className="absolute left-[-150px] w-full bg-[#bcd5f4] p-6 rounded-2xl shadow-2xl text-indigo-950 font-['Times_New_Roman']"
                >
                  <center>
                    <h2 className="text-2xl font-semibold mb-4">
                      {genMode
                        ? "Train Email Generator"
                        : "Generate personalized email"}
                    </h2>
                  </center>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block mb-1 font-medium">
                      Email Subject
                    </label>

                    <input
                      id="subjectInput"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#b6caff] text-black focus:outline-none focus:ring-2 focus:ring-blue-900"
                      required
                    />
                  </div>
                  {genMode ? (
                    <div className="mb-6">
                      <label
                        htmlFor="bodyInput"
                        className="block mb-1 font-medium"
                      >
                        Email Body
                      </label>

                      <textarea
                        id="bodyInput"
                        rows="6"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#b6caff] text-black focus:outline-none focus:ring-2 focus:ring-blue-900"
                        required
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <center className="flex gap-4 justify-center">
                    {genMode ? (
                      <button
                        type="submit"
                        className="w-40 p-2 bg-transparent hover:bg-[#a1baff] hover:w-52 py-3 rounded-[50px] font-semibold transition-all border-[2px] border-solid border-blue-950"
                      >
                        Submit Email
                      </button>
                    ) : (
                      ""
                    )}

                    {!genMode ? (
                      <button
                        type="button"
                        onClick={handleGenerateEmail}
                        className="w-40 p-2 bg-transparent hover:bg-[#a1baff] hover:w-52 py-3 rounded-[50px] font-semibold transition-all border-[2px] border-solid border-blue-950"
                      >
                        Gen Email
                      </button>
                    ) : (
                      ""
                    )}
                  </center>
                </motion.form>
              </div>
            )}

            {activeTab === "diary" && (
              <motion.div
                key="diary"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={getDirection()}
                className="absolute w-[600px] bg-[#1e3a5f] p-6 rounded-2xl shadow-2xl text-center left-[-80px]"
              >
                <Diary />
              </motion.div>
            )}

            {activeTab === "form" && (
              <motion.div
                key="form"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={getDirection()}
                className="absolute w-full bg-[#1e3a5f] p-6 rounded-2xl shadow-2xl"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  Auto-Fill Google Form
                </h2>
                <p className="text-blue-300 mb-4">
                  Paste your form URL and let AI handle the rest.
                </p>
                <input
                  type="url"
                  placeholder="Enter Google Form URL"
                  className="w-full mb-4 p-3 rounded-lg bg-[#16213e] text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-all">
                  Auto-Fill Form
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
