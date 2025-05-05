"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";

export default function Home() {
  const router = useRouter();
  const [profession, setProfession] = useState("");
  const [stage, setStage] = useState(0);
  const [concept, setConcept] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const fetchConcept = async () => {
    const response = await fetch("http://127.0.0.1:5000/get-concept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profession }),
    });
    const data = await response.json();
    setConcept(data.concept);
  };

  const handleStart = async () => {
    if (profession) {
      await fetchConcept();
      setStage(1);
    }
  };

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:5000/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept, user_response: userResponse }),
    });
    const data = await response.json();
    setEvaluation(data.evaluation);
    setStage(2);
  };

  const handleRolePlay = () => {
    alert(
      `Role-Play: As a ${profession}, your next task is to respond to a real-world situation.`
    );
    setStage(3);
  };

  return (
    <div>
      <Navbar />
      {stage === 0 && (
        <div className="flex flex-col items-center gap-9 justify-center min-h-screen rounded-lg bg-gray-700">
          <h1
            className="text-3xl font-bold mb-4"
            style={{
              fontSize: "100px",
              fontStyle: "italic",
              fontFamily: "times",
            }}
          >
            Enter Your Profession
          </h1>
          <input
            type="text"
            style={{
              color: "#222",
              width: "350px",
              height: "80px",
              borderRadius: "50px",
              padding: "10px",
              fontFamily: "fantasy",
              fontSize: "50px",
              textAlign: "center",
            }}
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />
          <button
            onClick={handleStart}
            className="mt-4 px-4 py-2 bg-slate-800 rounded-2xl text-white hover:bg-black hover:scale-125 transition-all ease-in-out"
          >
            Start Evaluation
          </button>
        </div>
      )}

      {stage === 1 && (
        <div
          className="flex flex-col items-center justify-center  bg-gray-900 p-4 gap-3"
          style={{ height: "100%" }}
        >
          <h1
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "monospace" }}
          >
            {profession} Evaluation
          </h1>
          <div className="text-center">
            <h3
              className="mb-2 text-violet-300 "
              style={{ fontFamily: "times", fontSize: "20px" }}
            >
              Explain the concept: <strong>{concept}</strong>
            </h3>
            <br />
            <textarea
              style={{
                color: "black",
                width: "600px",
                height: "350px",
                borderRadius: "50px",
                boxShadow: "3px 3px 10px black",
                padding: "15px",
              }}
              className="border p-2 w-full"
              rows="4"
              placeholder="Teach the system..."
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
            ></textarea>
            <br />
            <br />
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-950 text-white rounded-2xl"
            >
              Submit Explanation
            </button>
          </div>
        </div>
      )}

      {stage === 2 && evaluation && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
          <h2
            className="text-4xl font-bold mb-8 text-white"
            style={{ fontFamily: "monospace" }}
          >
            Evaluation Results
          </h2>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {/* Metric 1: Clarity */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3
                className="text-white text-2xl font-semibold mb-2"
                style={{ fontFamily: "times" }}
              >
                Clarity
              </h3>
              <p className="text-white text-xl">
                {evaluation.clarity || "N/A"}
              </p>
            </div>

            {/* Metric 2: Accuracy */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3
                className="text-white text-2xl font-semibold mb-2"
                style={{ fontFamily: "times" }}
              >
                Accuracy
              </h3>
              <p className="text-white text-xl">
                {evaluation.accuracy || "N/A"}
              </p>
            </div>

            {/* Metric 3: Depth */}
            <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3
                className="text-white text-2xl font-semibold mb-2"
                style={{ fontFamily: "times" }}
              >
                Depth
              </h3>
              <p className="text-white text-xl">{evaluation.depth || "N/A"}</p>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
            <h3
              className="text-violet-300 text-2xl font-bold mb-4"
              style={{ fontFamily: "monospace" }}
            >
              Feedback
            </h3>
            <p
              className="text-white text-lg leading-relaxed"
              style={{ fontFamily: "Arial" }}
            >
              {evaluation.feedback || "No feedback available."}
            </p>
          </div>

          <button
            onClick={handleRolePlay}
            className="mt-12 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 hover:scale-110 transition-all ease-in-out"
          >
            Start Role-Play
          </button>
        </div>
      )}

      {stage === 3 && (
        <div className="text-center flex flex-col items-center justify-center min-h-screen bg-gray-800">
          <p className="mb-2">Role-Play Scenario: Respond as a {profession}</p>
          <button
            onClick={() => router.push("/result")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Complete Role-Play
          </button>
        </div>
      )}
    </div>
  );
}
