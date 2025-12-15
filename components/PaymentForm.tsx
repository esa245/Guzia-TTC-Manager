import React, { useState } from 'react';
import { Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import { Student, PaymentMethod, INCOME_CATEGORIES } from '../types';

interface PaymentFormProps {
  onAddPayment: (id: string, payment: { amount: number; date: string; method: PaymentMethod; category: string }) => boolean;
  students: Student[];
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onAddPayment, students }) => {
  const [payId, setPayId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [category, setCategory] = useState<string>(INCOME_CATEGORIES[1]); // Default to Monthly Fee
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleIdBlur = () => {
    if (!payId.trim()) {
      setFoundStudent(null);
      return;
    }
    const student = students.find(s => s.id.toLowerCase() === payId.trim().toLowerCase());
    setFoundStudent(student || null);
    if (student) setPayId(student.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    const targetStudent = students.find(s => s.id.toLowerCase() === payId.trim().toLowerCase());

    if (!targetStudent) {
      alert('ভুল আইডি! এই আইডিতে কোনো ছাত্র পাওয়া যায়নি। দয়া করে আইডি চেক করুন।');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
        alert('দয়া করে সঠিক টাকার পরিমাণ উল্লেখ করুন (0 এর বেশি)।');
        return;
    }

    const success = onAddPayment(targetStudent.id, {
      amount: amountValue,
      date: date,
      method: method,
      category: category
    });

    if (success) {
      setSuccessMessage(`${targetStudent.name}-এর একাউন্টে ${amountValue} টাকা জমা হয়েছে।`);
      setAmount('');
      setPayId('');
      setFoundStudent(null);
      setDate(new Date().toISOString().split('T')[0]);
      
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      alert('দুঃখিত, টাকা জমা হতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-green-600 p-4 text-white font-bold text-lg flex items-center gap-2">
        <Banknote size={20} />
        ফি জমা নিন (Income Entry)
      </div>
      <div className="p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3 text-green-800 animate-fade-in">
            <CheckCircle size={24} className="text-green-600" />
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">স্টুডেন্ট আইডি (Student ID)</label>
            <div className="relative">
              <input
                type="text"
                required
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
                  foundStudent ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="GTTC-101"
                value={payId}
                onChange={e => {
                  setPayId(e.target.value);
                  if (foundStudent && e.target.value.trim().toLowerCase() !== foundStudent.id.toLowerCase()) {
                    setFoundStudent(null);
                  }
                }}
                onBlur={handleIdBlur}
              />
              {foundStudent && (
                 <CheckCircle className="absolute right-3 top-3 text-green-600" size={24} />
              )}
            </div>

            {foundStudent ? (
               <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                 <div className="flex items-center gap-2 text-green-800 font-bold mb-1">
                   <CheckCircle size={18} /> 
                   <span>ছাত্র পাওয়া গেছে</span>
                 </div>
                 <div className="text-sm space-y-1 text-gray-700 ml-1">
                    <p>নাম: <strong>{foundStudent.name}</strong></p>
                    <p>কোর্স: {foundStudent.course}</p>
                 </div>
               </div>
            ) : payId.length > 3 && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle size={16} /> কোনো ছাত্র পাওয়া যায়নি
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">আয়ের খাত (Category)</label>
                <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">পেমেন্ট মেথড</label>
                <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={method}
                    onChange={e => setMethod(e.target.value as PaymentMethod)}
                >
                    <option value="Cash">Cash (হাতে নগদ)</option>
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank">Bank Transfer</option>
                </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">জমার পরিমাণ (টাকা)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: 1000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">তারিখ</label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow transition-colors flex justify-center items-center gap-2"
          >
            <Banknote size={20} />
            টাকা জমা করুন
          </button>
        </form>
      </div>
    </div>
  );
};