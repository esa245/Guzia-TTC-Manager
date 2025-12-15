import React, { useState } from 'react';
import { Expense, EXPENSE_CATEGORIES, PaymentMethod } from '../types';
import { TrendingDown, Trash2, PlusCircle, Search, CheckCircle } from 'lucide-react';

interface ExpenseManagerProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({ expenses, onAddExpense, onDeleteExpense }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: EXPENSE_CATEGORIES[0] as string,
    description: '',
    method: 'Cash' as PaymentMethod,
    date: new Date().toISOString().split('T')[0]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    onAddExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      method: formData.method,
      date: formData.date
    });

    // Show success message
    setSuccessMessage('খরচ সফলভাবে যুক্ত করা হয়েছে!');

    // Reset
    setFormData({
      amount: '',
      category: EXPENSE_CATEGORIES[0],
      description: '',
      method: 'Cash',
      date: new Date().toISOString().split('T')[0]
    });

    // Clear message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const filteredExpenses = expenses.filter(e => 
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Expense Entry Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-orange-600 p-4 text-white font-bold text-lg flex items-center gap-2">
                <TrendingDown size={20} />
                খরচের হিসাব (Add Expense)
            </div>
            <div className="p-6">
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2 text-green-800 animate-fade-in text-sm font-bold">
                    <CheckCircle size={18} className="text-green-600" />
                    <span>{successMessage}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">খরচের খাত (Category)</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">বিবরণ (Description)</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                            placeholder="বিস্তারিত লিখুন..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">পরিমাণ (Amount)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                            placeholder="500"
                            value={formData.amount}
                            onChange={e => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">পেমেন্ট মেথড</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                            value={formData.method}
                            onChange={e => setFormData({...formData, method: e.target.value as PaymentMethod})}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Rocket">Rocket</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">তারিখ</label>
                        <input
                            type="date"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg shadow flex justify-center items-center gap-2"
                    >
                        <PlusCircle size={18} /> খরচ সেভ করুন
                    </button>
                </form>
            </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><TrendingDown size={18}/> খরচের তালিকা</h3>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-8 pr-2 py-1 rounded text-gray-800 text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Search size={14} className="absolute left-2 top-2 text-gray-500"/>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="p-3 border-b">তারিখ</th>
                            <th className="p-3 border-b">খাত</th>
                            <th className="p-3 border-b">বিবরণ</th>
                            <th className="p-3 border-b">মেথড</th>
                            <th className="p-3 border-b text-right">টাকা</th>
                            <th className="p-3 border-b text-center">একশন</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {filteredExpenses.length === 0 ? (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-500">কোনো খরচের তথ্য নেই</td></tr>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{expense.date}</td>
                                    <td className="p-3 font-medium text-orange-700">{expense.category}</td>
                                    <td className="p-3">{expense.description}</td>
                                    <td className="p-3">
                                        <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">{expense.method}</span>
                                    </td>
                                    <td className="p-3 text-right font-bold">৳ {expense.amount}</td>
                                    <td className="p-3 text-center">
                                        <button 
                                            onClick={() => onDeleteExpense(expense.id)}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};