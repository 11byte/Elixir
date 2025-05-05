
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, User, Home } from 'lucide-react';
import ApiKeySettings from './ApiKeySettings';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav 
      className="bg-[#1A1F2C] text-white py-4 px-6 shadow-lg border-b border-[#403E43]/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Book size={24} className="text-[#8B5CF6]" />
          <span className="font-bold text-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">ProfMentor</span>
        </motion.div>
        
        <div className="flex items-center space-x-6">
          <motion.div 
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, color: "#8B5CF6" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Home size={18} />
            <span>Home</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.05, color: "#8B5CF6" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <User size={18} />
            <span>Profile</span>
          </motion.div>
          <ApiKeySettings />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
