
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { professionConcepts, conceptDefinitions } from '../data/professionData';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { evaluateExplanation, getGeminiApiKey } from '../utils/geminiAPI';

const Evaluation = () => {
  const navigate = useNavigate();
  const [profession, setProfession] = useState('');
  const [stage, setStage] = useState(1); // 1: Teaching, 2: Results, 3: Role-play
  const [concept, setConcept] = useState('');
  const [userExplanation, setUserExplanation] = useState('');
  const [evaluationScore, setEvaluationScore] = useState(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get profession from localStorage
    const savedProfession = localStorage.getItem('profession');
    if (!savedProfession) {
      toast.error("No profession selected. Redirecting to home.");
      navigate('/');
      return;
    }

    setProfession(savedProfession);

    // Select a random concept for the profession
    const concepts = professionConcepts[savedProfession.toLowerCase()] || [
      "General Knowledge",
      "Critical Thinking",
      "Professional Ethics",
      "Communication Skills",
      "Problem Solving"
    ];
    
    const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
    setConcept(randomConcept);
  }, [navigate]);

  const handleEvaluateExplanation = async () => {
    if (!userExplanation.trim()) {
      toast.error("Please provide an explanation before submitting");
      return;
    }

    // Check if API key is available
    if (!getGeminiApiKey()) {
      toast.error("Please set your Gemini API key in the settings first");
      return;
    }

    setLoading(true);

    try {
      const definition = conceptDefinitions[concept] || "";
      const result = await evaluateExplanation(concept, userExplanation, definition);
      
      setEvaluationScore(result.score);
      setEvaluationFeedback(result.feedback);
      setStage(2);
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error("Error evaluating your explanation");
    } finally {
      setLoading(false);
    }
  };

  const handleRolePlayStart = () => {
    // Store evaluation result in localStorage
    localStorage.setItem('teachingScore', evaluationScore.toString());
    
    // Navigate to role play page
    navigate('/roleplay');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Professional Evaluation</h1>
            <div className="text-xl font-medium capitalize text-gray-700">{profession}</div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Teaching</span>
              <span>Role Play</span>
            </div>
            <Progress value={stage === 1 ? 25 : stage === 2 ? 50 : 75} className="h-2" />
          </div>
        </div>

        {stage === 1 && (
          <Card className="p-8 stage-transition">
            <h2 className="text-2xl font-bold mb-6">Reverse Teaching Evaluation</h2>
            <p className="text-gray-600 mb-2">
              Explain the following concept in your own words, as if you were teaching it to someone unfamiliar with your field:
            </p>
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="text-xl font-semibold text-blue-700">{concept}</h3>
            </div>
            
            <Textarea
              placeholder="Enter your explanation here..."
              className="min-h-[200px] mb-4"
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleEvaluateExplanation}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Evaluating..." : "Submit Explanation"}
              </Button>
            </div>
          </Card>
        )}

        {stage === 2 && (
          <Card className="p-8 stage-transition">
            <h2 className="text-2xl font-bold mb-6">Evaluation Results</h2>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{evaluationScore}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={evaluationScore >= 80 ? "#10b981" : evaluationScore >= 60 ? "#3b82f6" : evaluationScore >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${evaluationScore}, 100`}
                  />
                </svg>
              </div>
              
              <div className="flex items-center">
                {evaluationScore >= 80 ? (
                  <CheckCircle2 className="text-green-500 mr-2" />
                ) : evaluationScore >= 40 ? (
                  <AlertCircle className="text-amber-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                <span className="text-lg font-medium">
                  {evaluationScore >= 80 ? "Excellent" : 
                   evaluationScore >= 60 ? "Good" : 
                   evaluationScore >= 40 ? "Fair" : "Needs Improvement"}
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Feedback:</h3>
              <p className="text-gray-700">{evaluationFeedback}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Your Explanation:</h3>
              <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                {userExplanation}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Standard Definition:</h3>
              <div className="bg-blue-50 p-4 rounded-md text-gray-700">
                {conceptDefinitions[concept] || "Standard definition not available for this concept."}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleRolePlayStart}
                className="bg-primary hover:bg-primary/90"
              >
                Continue to Role Play
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
