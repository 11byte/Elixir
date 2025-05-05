
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle2, Award, ArrowRight } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const [profession, setProfession] = useState('');
  const [teachingScore, setTeachingScore] = useState(0);
  const [rolePlayScore, setRolePlayScore] = useState(0);
  const [rolePlayFeedback, setRolePlayFeedback] = useState('');
  const [strengths, setStrengths] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [overallRating, setOverallRating] = useState('');

  useEffect(() => {
    // Get data from localStorage
    const savedProfession = localStorage.getItem('profession');
    const savedTeachingScore = localStorage.getItem('teachingScore');
    const savedRolePlayScore = localStorage.getItem('rolePlayScore');
    const savedRolePlayFeedback = localStorage.getItem('rolePlayFeedback');
    const savedStrengths = localStorage.getItem('rolePlayStrengths');
    const savedImprovements = localStorage.getItem('rolePlayImprovements');
    
    if (!savedProfession || !savedTeachingScore || !savedRolePlayScore) {
      navigate('/');
      return;
    }

    setProfession(savedProfession);
    setTeachingScore(parseInt(savedTeachingScore, 10));
    setRolePlayScore(parseInt(savedRolePlayScore, 10));
    setRolePlayFeedback(savedRolePlayFeedback || '');
    
    try {
      setStrengths(JSON.parse(savedStrengths) || []);
      setImprovements(JSON.parse(savedImprovements) || []);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      setStrengths([]);
      setImprovements([]);
    }

    // Generate overall rating
    const avgScore = (parseInt(teachingScore, 10) + parseInt(savedRolePlayScore, 10)) / 2;
    let rating = '';
    if (avgScore >= 90) rating = "Expert";
    else if (avgScore >= 80) rating = "Advanced";
    else if (avgScore >= 70) rating = "Proficient";
    else if (avgScore >= 60) rating = "Competent";
    else rating = "Developing";
    
    setOverallRating(rating);
  }, [navigate, teachingScore]);

  const handleStartAgain = () => {
    // Clear localStorage
    localStorage.removeItem('profession');
    localStorage.removeItem('teachingScore');
    localStorage.removeItem('rolePlayResponse');
    localStorage.removeItem('rolePlayScore');
    localStorage.removeItem('rolePlayFeedback');
    localStorage.removeItem('rolePlayStrengths');
    localStorage.removeItem('rolePlayImprovements');
    
    // Navigate to home
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12 stage-transition">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Evaluation Complete</h1>
          <p className="text-xl text-gray-600">
            Here's your detailed professional assessment
          </p>
        </div>

        <div className="mb-12 stage-transition">
          <Card className="p-8 border-t-4 border-t-primary">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profession} <span className="text-primary">Assessment Results</span>
                </h2>
                <p className="text-gray-600 mt-1">
                  Based on your concept explanation and role play scenario response
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <Award className="h-8 w-8 text-yellow-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Overall Rating</div>
                  <div className="text-xl font-bold">{overallRating}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Conceptual Knowledge</h3>
                  <span className="text-primary font-bold">{teachingScore}%</span>
                </div>
                <p className="text-gray-600 text-sm">
                  {teachingScore >= 80 ? "Excellent conceptual knowledge" : 
                   teachingScore >= 60 ? "Good understanding of concepts" : 
                   "Basic conceptual understanding"}
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Practical Application</h3>
                  <span className="text-primary font-bold">{rolePlayScore}%</span>
                </div>
                <p className="text-gray-600 text-sm">{rolePlayFeedback}</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Strengths</h3>
                </div>
                <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                  {strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Areas for Improvement</h3>
                </div>
                <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                  {improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Development Recommendations:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Continue to develop your conceptual knowledge through reading professional journals.</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Practice explaining complex concepts to peers to improve your communication skills.</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Seek out additional role-play scenarios to enhance your practical application skills.</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleStartAgain}
            size="lg" 
            className="bg-primary hover:bg-primary/90"
          >
            Start New Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
