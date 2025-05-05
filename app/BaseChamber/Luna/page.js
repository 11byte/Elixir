"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { motion } from "framer-motion";
import QCard from "./QCard";
import ChatBot from "./ChatBot";
import { FaTrash } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
const questions = [
  // Extraversion (EXT)
  { question: "I am the life of the party.", id: "EXT1" },
  { question: "I don't talk a lot.", id: "EXT2" },
  { question: "I feel comfortable around people.", id: "EXT3" },
  { question: "I keep in the background.", id: "EXT4" },
  { question: "I start conversations.", id: "EXT5" },
  { question: "I have little to say.", id: "EXT6" },
  { question: "I talk to a lot of different people at parties.", id: "EXT7" },
  { question: "I don't like to draw attention to myself.", id: "EXT8" },
  { question: "I don't mind being the center of attention.", id: "EXT9" },
  { question: "I am quiet around strangers.", id: "EXT10" },

  // Neuroticism (EST)
  { question: "I get stressed out easily.", id: "EST1" },
  { question: "I am relaxed most of the time.", id: "EST2" },
  { question: "I worry about things.", id: "EST3" },
  { question: "I seldom feel blue.", id: "EST4" },
  { question: "I am easily disturbed.", id: "EST5" },
  { question: "I get upset easily.", id: "EST6" },
  { question: "I change my mood a lot.", id: "EST7" },
  { question: "I have frequent mood swings.", id: "EST8" },
  { question: "I get irritated easily.", id: "EST9" },
  { question: "I often feel blue.", id: "EST10" },

  // Agreeableness (AGR)
  { question: "I feel little concern for others.", id: "AGR1" },
  { question: "I am interested in people.", id: "AGR2" },
  { question: "I insult people.", id: "AGR3" },
  { question: "I sympathize with others' feelings.", id: "AGR4" },
  { question: "I am not interested in other people's problems.", id: "AGR5" },
  { question: "I have a soft heart.", id: "AGR6" },
  { question: "I am not really interested in others.", id: "AGR7" },
  { question: "I take time out for others.", id: "AGR8" },
  { question: "I feel others' emotions.", id: "AGR9" },
  { question: "I make people feel at ease.", id: "AGR10" },

  // Conscientiousness (CSN)
  { question: "I am always prepared.", id: "CSN1" },
  { question: "I leave my belongings around.", id: "CSN2" },
  { question: "I pay attention to details.", id: "CSN3" },
  { question: "I make a mess of things.", id: "CSN4" },
  { question: "I get chores done right away.", id: "CSN5" },
  {
    question: "I often forget to put things back in their proper place.",
    id: "CSN6",
  },
  { question: "I like order.", id: "CSN7" },
  { question: "I shirk my duties.", id: "CSN8" },
  { question: "I follow a schedule.", id: "CSN9" },
  { question: "I am exacting in my work.", id: "CSN10" },

  // Openness (OPN)
  { question: "I have a rich vocabulary.", id: "OPN1" },
  { question: "I have difficulty understanding abstract ideas.", id: "OPN2" },
  { question: "I have a vivid imagination.", id: "OPN3" },
  { question: "I am not interested in abstract ideas.", id: "OPN4" },
  { question: "I have excellent ideas.", id: "OPN5" },
  { question: "I do not have a good imagination.", id: "OPN6" },
  { question: "I am quick to understand things.", id: "OPN7" },
  { question: "I use difficult words.", id: "OPN8" },
  { question: "I spend time reflecting on things.", id: "OPN9" },
  { question: "I am full of ideas.", id: "OPN10" },
];

const btnStyle = {
  color: "#d1c7ff",
  border: "solid 2px #d1c7ff",
  padding: "5px",
  borderRadius: "20px",
};

const Luna = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [responses, setResponses] = useState({}); // Store responses in state

  const [result, setResult] = useState(null);
  const [isDashOpen, setDashOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  const handleSubmit = async () => {
    const storedAnswers = JSON.parse(localStorage.getItem("answers")) || {};
    const totalQuestions = 100; // Ensure we always send 100 responses

    // Convert object to an array of length 100, filling missing values with a default (e.g., 3)
    const answersArray = Array.from(
      { length: totalQuestions },
      (_, i) => storedAnswers[i] ?? 3
    );

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: answersArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const resultData = await response.json();
      setResult(resultData);
      console.log("ML Model Response:", resultData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Load the images based on the number of questions when the component mounts
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = Array.from(
        { length: questions.length },
        (_, index) =>
          fetch(
            `https://picsum.photos/1920/1080?random=${Math.floor(
              Math.random() * 1000
            )}`
          ).then((response) => response.url)
      );
      const imageUrls = await Promise.all(imagePromises);
      setImages(imageUrls);
    };

    loadImages();
  }, []);

  const clearAnswers = () => {
    localStorage.removeItem("answers");

    alert("All answers have been cleared!");
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Update the response and store it in localStorage
  const handleResponse = (index, value) => {
    const updatedResponses = { ...responses, [index]: value };
    setResponses(updatedResponses);
    localStorage.setItem("responses", JSON.stringify(updatedResponses));
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          key={questions[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{
            height: "500px",
            width: "1200px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "2px solid beige",
            borderRadius: "15px",
            position: "relative",
            padding: "20px",
            marginTop: "30px",
          }}
        >
          {/* Pass the corresponding background image and current question index */}
          {images[currentIndex] && (
            <QCard
              question={questions[currentIndex].question}
              id={questions[currentIndex].id}
              index={currentIndex} // Pass the index as prop
              backgroundImage={images[currentIndex]} // Pass the background image
              onResponse={handleResponse} // Pass the handleResponse function
            />
          )}
        </motion.div>
        <div
          style={{
            backgroundColor: "transparent",
            backdropFilter: "blur(60px)",
            color: "navy",
            position: "absolute",
            right: isDashOpen ? "15px" : "-1400px",
            transition: "all 0.3s ease",
            top: "60px",
            height: "1610px",
            width: "1400px",
            zIndex: "101",
            borderRadius: "50px",
            borderLeft: "solid 2px silver",
          }}
        >
          <div
            style={{
              color: "white",
              backgroundColor: "transparent",
              backdropFilter: "blur(100px)",
              padding: "15px",
              fontFamily: "roboto",
              width: "50%",
              borderRadius: "50px",
              marginLeft: "350px",
              boxShadow: "10px 10px 90px silver",
              marginTop: "15px",
            }}
          >
            <h2 style={{ color: "gold", fontStyle: "italic" }}>
              Extraversion (EXT)
            </h2>
            <p>
              Measures sociability, enthusiasm, and the tendency to seek
              stimulation in the company of others.
            </p>

            <h2 style={{ color: "gold", fontStyle: "italic" }}>
              Emotional Stability (EST)
            </h2>
            <p>
              Assesses resilience and the ability to remain calm under stress,
              opposite of neuroticism.
            </p>

            <h2 style={{ color: "gold", fontStyle: "italic" }}>
              Agreeableness (AGR)
            </h2>
            <p>
              Reflects compassion, cooperation, and the tendency to be trusting
              and helpful toward others.
            </p>

            <h2 style={{ color: "gold", fontStyle: "italic" }}>
              Conscientiousness (CSN)
            </h2>
            <p>
              Evaluates self-discipline, organization, and the ability to plan
              and execute tasks efficiently.
            </p>

            <h2 style={{ color: "gold", fontStyle: "italic" }}>
              Openness to Experience (OPN)
            </h2>
            <p>
              Captures imagination, curiosity, and the willingness to embrace
              new experiences and ideas.
            </p>
          </div>
          <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <motion.button
              onClick={() => setDashOpen(!isDashOpen)}
              style={{
                height: "50px",
                width: "30px",
                borderRadius: "30px",
                backgroundColor: "silver",
                position: "absolute",
                top: "20px",
                left: "-40px",
                fontSize: "20px",
              }}
            >
              ↜
            </motion.button>

            {result && (
              <div
                style={{
                  marginTop: "20px",
                  color: "navy",
                  textAlign: "center",
                }}
              >
                <h2>Personality Analysis</h2>
                {/* <p>Cluster: {result.cluster}</p>
                <p>{result.interpretation}</p>
                <h3>Traits:</h3> */}
                {result.personality_traits ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Object.entries(result.personality_traits).map(
                          ([trait, score]) => ({
                            name: trait,
                            value: score.toFixed(2),
                          })
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={Object.entries(result.personality_traits).map(
                          ([trait, score]) => ({
                            name: trait,
                            score: score,
                          })
                        )}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis />
                        <Radar
                          name="Traits"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(result.personality_traits).map(
                            ([trait, score]) => ({
                              name: trait,
                              score: score,
                            })
                          )}
                          dataKey="score"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {Object.entries(result.personality_traits).map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={Object.entries(result.personality_traits).map(
                          ([trait, score]) => ({
                            name: trait,
                            score: score,
                          })
                        )}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <p>No personality traits available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "60px",
            justifyContent: "space-evenly",
          }}
        >
          <button
            onClick={clearAnswers}
            style={{
              padding: "10px", // Increase padding for a better circular shape
              color: "red",
              backgroundColor: "transparent",
              border: "solid 2px red",
              borderRadius: "50%", // Set border radius to 50% for a circular shape
              width: "40px", // Set width and height to make it consistent
              height: "40px", // Same as width for a perfect circle
              display: "flex", // Flex to center the icon inside
              justifyContent: "center", // Center the icon horizontally
              alignItems: "center", // Center the icon vertically
            }}
          >
            <FaTrash />
          </button>
          <button
            style={btnStyle}
            onClick={prevQuestion}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            style={btnStyle}
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "5px",
              color: "white",
              backgroundColor: "transparent",
              border: "solid 2px turquoise",
              borderRadius: "5px",
            }}
          >
            Submit
          </button>
          <script src="https://cdn.lordicon.com/lordicon.js"></script>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "transparent",
          backdropFilter: "blur(60px)",
          color: "navy",
          position: "absolute",
          right: isChatOpen ? "15px" : "-1400px",
          transition: "all 0.3s ease",
          top: "60px",
          height: "1610px",
          width: "1400px",
          zIndex: "80",
          borderRadius: "50px",
          borderLeft: "solid 2px silver",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            padding: "20px",
          }}
        >
          <motion.button
            onClick={() => setChatOpen(!isChatOpen)}
            style={{
              height: "50px",
              width: "30px",
              borderRadius: "30px",
              backgroundColor: "silver",
              position: "absolute",
              top: "60px",
              left: "-40px",
              fontSize: "20px",
            }}
          >
            ֎
          </motion.button>
          <ChatBot />
        </div>
      </div>
    </div>
  );
};

export default Luna;
