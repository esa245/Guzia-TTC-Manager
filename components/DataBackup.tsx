import React, { useRef, useState } from 'react';
import { Student, Expense } from '../types';
import { Download, Upload, Trash2, Database, AlertTriangle, FileJson, CheckCircle } from 'lucide-react';

interface DataBackupProps {
  students: Student[];
  expenses: Expense[];
  onImport: (data: { students: Student[], expenses: Expense[] }) => boolean;
  onReset: () => boolean;
}

export const DataBackup: React.FC<DataBackupProps> = ({ students, expenses, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownload = () => {
    const data = {
      students,
      expenses,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GTTC_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Basic validation
        if (Array.isArray(json.students) && Array.isArray(json.expenses)) {
            const success = onImport({
                students: json.students,
                expenses: json.expenses
            });

            if (success) {
                setSuccessMessage('ডেটা সফলভাবে রিস্টোর করা হয়েছে!');
                setTimeout(() => setSuccessMessage(null), 5000);
            }
        } else {
            alert('ভুল ফরম্যাটের ফাইল! সঠিক ব্যাকআপ ফাইল আপলোড করুন।');
        }
      } catch (err) {
        alert('ফাইল রিড করতে সমস্যা হয়েছে। দয়া করে সঠিক JSON ফাইল দিন।');
        console.error(err);
      }
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
      const success = onReset();
      if (success) {
          setSuccessMessage('সমস্ত ডেটা রিসেট করা হয়েছে!');
          setTimeout(() => setSuccessMessage(null), 5000);
      }
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-3">
             <Database size={28} />
             ডেটা ব্যাকআপ ও রিস্টোর
          </h2>
          <p className="opacity-90 mt-2">আপনার গুরুত্বপূর্ণ ডেটা নিরাপদ রাখতে নিয়মিত ডাউনলোড করে রাখুন।</p>
       </div>

       {successMessage && (
          <div className="p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3 text-green-800 animate-fade-in shadow-md">
            <CheckCircle size={28} className="text-green-600" />
            <span className="font-bold text-lg">{successMessage}</span>
          </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Download Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
             <div className="flex items-center gap-3 mb-4 text-green-700">
                <Download size={24} />
                <h3 className="text-xl font-bold">ব্যাকআপ ডাউনলোড</h3>
             </div>
             <p className="text-gray-600 mb-6 text-sm">
                বর্তমান সমস্ত ছাত্র এবং খরচের হিসাব একটি ফাইলে সেভ করে আপনার ডিভাইসে রাখুন। সার্ভার ছাড়া ডেটা সেভ রাখার এটিই সবচেয়ে নিরাপদ উপায়।
             </p>
             <button 
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors"
             >
                <FileJson size={20} />
                ডেটা ডাউনলোড করুন (JSON)
             </button>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
             <div className="flex items-center gap-3 mb-4 text-blue-700">
                <Upload size={24} />
                <h3 className="text-xl font-bold">ব্যাকআপ রিস্টোর</h3>
             </div>
             <p className="text-gray-600 mb-6 text-sm">
                আগে ডাউনলোড করা ব্যাকআপ ফাইলটি এখানে আপলোড করলে পুরনো সব হিসাব আবার ফিরে আসবে।
             </p>
             <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
             />
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors"
             >
                <Upload size={20} />
                ব্যাকআপ ফাইল আপলোড করুন
             </button>
          </div>
       </div>

       {/* Danger Zone */}
       <div className="bg-red-50 rounded-xl shadow border border-red-200 p-6 mt-8">
          <div className="flex items-center gap-2 text-red-600 mb-2 font-bold text-lg">
             <AlertTriangle size={24} />
             ডেঞ্জার জোন (Danger Zone)
          </div>
          <p className="text-gray-700 mb-4 text-sm">
             নিচের বাটনটি চাপলে সফটওয়্যারের <strong>সকল তথ্য মুছে যাবে</strong>। এটি করার আগে অবশ্যই ব্যাকআপ ডাউনলোড করে নিন।
          </p>
          <button 
             onClick={handleReset}
             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
             <Trash2 size={18} />
             সব ডেটা রিসেট করুন
          </button>
       </div>
    </div>
  );
};