
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { User, UserCheck } from 'lucide-react';
import { generateRolePlayScenario, evaluateRolePlayResponse, getGeminiApiKey } from '../utils/geminiAPI';

const RolePlay = () => {
  const navigate = useNavigate();
  const [profession, setProfession] = useState('');
  const [scenario, setScenario] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    // Get profession from localStorage
    const savedProfession = localStorage.getItem('profession');
    if (!savedProfession) {
      toast.error("No profession selected. Redirecting to home.");
      navigate('/');
      return;
    }

    setProfession(savedProfession);

    // Check if API key is available
    if (!getGeminiApiKey()) {
      toast.error("Please set your Gemini API key in the settings");
      return;
    }

    // Load or generate scenario
    const loadScenario = async () => {
      setLoading(true);
      try {
        const generatedScenario = await generateRolePlayScenario(savedProfession);
        setScenario(generatedScenario);
      } catch (error) {
        console.error("Failed to generate scenario:", error);
        toast.error("Failed to generate scenario");
        // Fallback scenario
        setScenario({
          title: "General Professional Scenario",
          scenario: "A colleague has made a mistake that could have significant consequences for a client/customer. How would you approach this situation?",
          expectedPoints: ["Professional communication", "Ethics", "Problem solving", "Accountability", "Client/customer focus"]
        });
      } finally {
        setLoading(false);
      }
    };

    loadScenario();
  }, [navigate]);

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) {
      toast.error("Please provide a response to the scenario");
      return;
    }

    setLoading(true);

    try {
      const result = await evaluateRolePlayResponse(profession, scenario, userResponse);
      setEvaluation(result);
      setSubmitted(true);
      
      // Store evaluation in localStorage
      localStorage.setItem('rolePlayScore', result.score.toString());
      localStorage.setItem('rolePlayFeedback', result.feedback);
      localStorage.setItem('rolePlayStrengths', JSON.stringify(result.strengths));
      localStorage.setItem('rolePlayImprovements', JSON.stringify(result.improvements));
      localStorage.setItem('rolePlayResponse', userResponse);
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error("Error evaluating your response");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteEvaluation = () => {
    // Navigate to results page
    navigate('/results');
  };

  if (!scenario || loading && !submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-pulse">Loading scenario...</div>
        </div>
      </div>
    );
  }

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
            <Progress value={submitted ? 90 : 75} className="h-2" />
          </div>
        </div>

        <Card className="p-8 stage-transition">
          <h2 className="text-2xl font-bold mb-6">Role Play Scenario: {scenario.title}</h2>
          
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Scenario:</h3>
                <p className="text-gray-700">{scenario.scenario}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-semibold mb-2">Your Response:</h3>
                {!submitted ? (
                  <Textarea
                    placeholder="Enter your response to this scenario..."
                    className="min-h-[200px] w-full"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    disabled={submitted}
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-gray-700 min-h-[200px]">
                    {userResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {submitted && evaluation && (
            <div className="mb-8 stage-transition">
              <h3 className="font-semibold mb-2">Evaluation:</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <div className="font-bold text-xl mr-2">Score: {evaluation.score}%</div>
                </div>
                <p className="mb-4">{evaluation.feedback}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {evaluation.strengths.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-700 mb-2">Areas for Improvement:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {evaluation.improvements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            {!submitted ? (
              <Button 
                onClick={handleSubmitResponse}
                disabled={loading || !userResponse.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Evaluating..." : "Submit Response"}
              </Button>
            ) : (
              <Button 
                onClick={handleCompleteEvaluation}
                className="bg-primary hover:bg-primary/90"
              >
                View Final Results
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RolePlay;
