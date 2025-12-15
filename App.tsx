import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AdmissionForm } from './components/AdmissionForm';
import { PaymentForm } from './components/PaymentForm';
import { StudentList } from './components/StudentList';
import { ExpenseManager } from './components/ExpenseManager';
import { useStudents } from './hooks/useStudents';
import { TabType } from './types';
import { LayoutDashboard, UserPlus, Banknote, Users, TrendingDown } from 'lucide-react';

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { students, expenses, addStudent, addPayment, deleteStudent, addExpense, deleteExpense } = useStudents();

  if (!showDashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900">Home page hallo</h1>
        <button 
          onClick={() => setShowDashboard(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
        >
          <LayoutDashboard size={24} />
          হিসাব-নিকাশ শুরু করুন
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} expenses={expenses} />;
      case 'admission':
        return <AdmissionForm onAddStudent={addStudent} students={students} />;
      case 'payment':
        return <PaymentForm onAddPayment={addPayment} students={students} />;
      case 'database':
        return <StudentList students={students} onDelete={deleteStudent} />;
      case 'expense':
        return <ExpenseManager expenses={expenses} onAddExpense={addExpense} onDeleteExpense={deleteExpense} />;
      default:
        return <Dashboard students={students} expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Navigation Menu */}
      <div className="bg-white shadow sticky top-0 z-10 overflow-x-auto">
        <div className="container mx-auto">
          <div className="flex justify-start md:justify-center min-w-max p-2 space-x-2">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={20}/>} 
              label="ড্যাশবোর্ড" 
            />
            <NavButton 
              active={activeTab === 'admission'} 
              onClick={() => setActiveTab('admission')} 
              icon={<UserPlus size={20}/>} 
              label="নতুন ভর্তি" 
            />
            <NavButton 
              active={activeTab === 'payment'} 
              onClick={() => setActiveTab('payment')} 
              icon={<Banknote size={20}/>} 
              label="টাকা জমা" 
            />
            <NavButton 
              active={activeTab === 'expense'} 
              onClick={() => setActiveTab('expense')} 
              icon={<TrendingDown size={20}/>} 
              label="খরচ" 
            />
            <NavButton 
              active={activeTab === 'database'} 
              onClick={() => setActiveTab('database')} 
              icon={<Users size={20}/>} 
              label="ছাত্র তালিকা" 
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {/* Added key={activeTab} to force animation restart on tab change */}
      <main key={activeTab} className="flex-grow container mx-auto p-4 md:p-6 animate-fade-in">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} গুজিয়া টেকনিক্যাল ট্রেনিং সেন্টার | কারিগরি শিক্ষা বোর্ডে অনুমোদিত</p>
      </footer>
    </div>
  );
};

// Helper Component for Navigation Buttons
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
        : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;