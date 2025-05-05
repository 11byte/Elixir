import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ responses }) => {
  const socialMediaScore = responses.socialMediaScore || 0;
  const anxietyScore = responses.anxietyScore || 0;
  const depressionScore = responses.depressionScore || 0;
  const wellbeingScore = responses.wellbeingScore || 0;

  const radarData = {
    labels: ['Social Media Usage', 'Anxiety', 'Depression', 'Well-being'],
    datasets: [
      {
        label: 'Mental Health Indicators',
        data: [socialMediaScore, anxietyScore, depressionScore, wellbeingScore],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Progress Over Time',
        data: [65, 70, 75, 80],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Mental Health Overview</h2>
          <div className="h-[300px]">
            <Radar data={radarData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
          <div className="h-[300px]">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Social Media Usage',
                recommendation: 'Consider setting specific times for social media use',
                score: socialMediaScore,
              },
              {
                title: 'Anxiety Management',
                recommendation: 'Practice deep breathing exercises daily',
                score: anxietyScore,
              },
              {
                title: 'Well-being Improvement',
                recommendation: 'Maintain a regular sleep schedule',
                score: wellbeingScore,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.recommendation}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(item.score / 100) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;