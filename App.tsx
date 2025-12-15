import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-900">Home page hallo</h1>
      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
      >
        <LayoutDashboard size={24} />
        হিসাব-নিকাশ শুরু করুন
      </button>
    </div>
  );
};

export default App;