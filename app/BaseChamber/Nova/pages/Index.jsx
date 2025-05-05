
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { professionConcepts } from '../data/professionData';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { BookOpen, Users, BriefcaseMedical, Scale, GraduationCap, Calculator } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedProfession, setSelectedProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const professionIcons = {
    doctor: <BriefcaseMedical className="h-12 w-12 text-blue-500" />,
    lawyer: <Scale className="h-12 w-12 text-purple-500" />,
    engineer: <BookOpen className="h-12 w-12 text-green-500" />,
    teacher: <GraduationCap className="h-12 w-12 text-red-500" />,
    accountant: <Calculator className="h-12 w-12 text-yellow-500" />,
    custom: <Users className="h-12 w-12 text-gray-500" />
  };

  const handleProfessionSelect = (profession) => {
    if (profession === 'custom') {
      setShowCustomInput(true);
      setSelectedProfession('');
    } else {
      setSelectedProfession(profession);
      setShowCustomInput(false);
    }
  };

  const handleStartEvaluation = () => {
    const professionToUse = selectedProfession || customProfession;
    
    if (!professionToUse) {
      toast.error("Please select or enter a profession");
      return;
    }

    // Store the selected profession in localStorage
    localStorage.setItem('profession', professionToUse);
    
    // Navigate to the evaluation page
    navigate('/evaluation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Professional Evaluation System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test and enhance your professional knowledge and skills through interactive evaluations and role-play scenarios
          </p>
        </div>

        <div className="mb-12 stage-transition">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Profession</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(professionIcons).map((profession) => (
              <Card 
                key={profession}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedProfession === profession ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleProfessionSelect(profession)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {professionIcons[profession]}
                  </div>
                  <h3 className="text-lg font-medium capitalize">{profession}</h3>
                </div>
              </Card>
            ))}
          </div>

          {showCustomInput && (
            <div className="mt-6 max-w-md mx-auto stage-transition">
              <label htmlFor="custom-profession" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Your Profession
              </label>
              <Input
                id="custom-profession"
                value={customProfession}
                onChange={(e) => setCustomProfession(e.target.value)}
                placeholder="e.g. Pharmacist, Architect, etc."
                className="mb-4"
              />
            </div>
          )}

          <div className="mt-10 text-center">
            <Button 
              onClick={handleStartEvaluation}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              Start Evaluation
            </Button>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg shadow-md p-8 stage-transition">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <span className="text-blue-800 font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold">Reverse Teaching</h3>
              </div>
              <p className="text-gray-600">
                You'll be presented with a concept relevant to your profession. Explain it in your own words, and we'll evaluate your understanding by comparing it to standard definitions.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <span className="text-blue-800 font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold">Role-Play Scenario</h3>
              </div>
              <p className="text-gray-600">
                Step into a realistic professional scenario relevant to your field. You'll respond to the situation as you would in real life, and we'll provide feedback on your approach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
