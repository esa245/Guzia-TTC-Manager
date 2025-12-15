import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AdmissionForm } from './components/AdmissionForm';
import { PaymentForm } from './components/PaymentForm';
import { StudentList } from './components/StudentList';
import { ExpenseManager } from './components/ExpenseManager';
import { DataBackup } from './components/DataBackup';
import { useStudents } from './hooks/useStudents';
import { TabType } from './types';
import { 
  UserPlus, 
  CreditCard, 
  Database, 
  TrendingDown, 
  LayoutDashboard, 
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react';

const App: React.FC = () => {
  const { 
    students, 
    expenses, 
    addStudent, 
    addPayment, 
    deleteStudent, 
    addExpense, 
    deleteExpense,
    importData,
    resetData 
  } = useStudents();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <LayoutDashboard size={20} /> },
    { id: 'admission', label: 'নতুন ভর্তি', icon: <UserPlus size={20} /> },
    { id: 'payment', label: 'টাকা জমা', icon: <CreditCard size={20} /> },
    { id: 'expense', label: 'খরচ হিসাব', icon: <TrendingDown size={20} /> },
    { id: 'database', label: 'ছাত্র তালিকা', icon: <Database size={20} /> },
    { id: 'settings', label: 'ডেটা ব্যাকআপ', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard students={students} expenses={expenses} />;
      case 'admission': return <AdmissionForm onAddStudent={addStudent} students={students} />;
      case 'payment': return <PaymentForm onAddPayment={addPayment} students={students} />;
      case 'expense': return <ExpenseManager expenses={expenses} onAddExpense={addExpense} onDeleteExpense={deleteExpense} />;
      case 'database': return <StudentList students={students} onDelete={deleteStudent} />;
      case 'settings': return <DataBackup students={students} expenses={expenses} onImport={importData} onReset={resetData} />;
      default: return <Dashboard students={students} expenses={expenses} />;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Top Main Header */}
      <div className="flex-none z-50 relative">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside 
          className={`
            bg-gray-900 text-white w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out z-30 shadow-2xl
            absolute inset-y-0 left-0 md:static md:translate-x-0 h-full
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center md:hidden bg-gray-900">
             <span className="font-bold text-lg text-blue-400">মেনু</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
               <X size={24} />
             </button>
          </div>

          {/* Desktop Sidebar Title */}
          <div className="p-6 border-b border-gray-800 hidden md:block">
            <h2 className="text-xl font-bold text-blue-400 tracking-wide">মেইন মেনু</h2>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium group
                  ${activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg translate-x-1' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
                  }
                `}
              >
                <span className={`${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
            <div className="flex justify-center items-center gap-1 mb-2 text-gray-600">
               <LogOut size={12}/> V 1.0.1
            </div>
            Developed for GTTC
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 w-full relative">
          
          {/* Mobile Header Bar */}
          <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center gap-3">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
             >
                <Menu size={24} />
             </button>
             <h2 className="font-bold text-gray-800 text-lg truncate">
                {menuItems.find(i => i.id === activeTab)?.label}
             </h2>
          </div>

          {/* Content Container */}
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
            <div className="animate-fade-in pb-10">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;