
import React, { useState, useEffect } from 'react';
import { Cog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiApiKey, setGeminiApiKey } from '../utils/geminiAPI';

const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setApiKey(getGeminiApiKey() || '');
  }, [open]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setGeminiApiKey(apiKey.trim());
    setError('');
    showSuccessToast('API key saved successfully');
    setOpen(false);
  };

  const showSuccessToast = (message) => {
    // Custom toast implementation with framer-motion
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50';
    toast.innerHTML = `
      <div class="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-4 py-2 rounded-md shadow-lg">
        ${message}
      </div>
    `;
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 500
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50
    }
  };

  return (
    <>
      <motion.button
        className="rounded-full p-2 bg-transparent border border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10"
        whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
      >
        <Cog className="h-4 w-4 text-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              onClick={() => setOpen(false)}
            />
            
            <motion.div 
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-[#221F26] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg border border-[#403E43]"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                <h3 className="text-lg font-semibold text-white">API Settings</h3>
              </div>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="gemini-api-key" className="text-sm font-medium text-gray-300">
                    Gemini API Key
                  </label>
                  <motion.input
                    id="gemini-api-key"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setError('');
                    }}
                    className="flex h-10 w-full rounded-md border border-[#403E43] bg-[#1A1F2C] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    whileFocus={{ scale: 1.02, borderColor: "#8B5CF6" }}
                  />
                  {error && (
                    <motion.p 
                      className="text-xs text-red-400"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  <p className="text-xs text-gray-400">
                    Get your API key from{' '}
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[#8B5CF6] underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
                <motion.button 
                  onClick={handleSave}
                  className="w-full inline-flex items-center justify-center h-10 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-md"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 8px rgb(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save API Key
                </motion.button>
              </div>
              
              <motion.button
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none text-white"
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="sr-only">Close</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApiKeySettings;
