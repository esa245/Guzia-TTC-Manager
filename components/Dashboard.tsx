import React, { useMemo } from 'react';
import { Student, Expense } from '../types';
import { Users, TrendingUp, AlertCircle, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface DashboardProps {
  students: Student[];
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students, expenses }) => {
  const stats = useMemo(() => {
    let totalFee = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Today's date string
    const today = new Date().toISOString().split('T')[0];
    let dailyIncome = 0;
    let dailyExpense = 0;

    // Calculate Income
    students.forEach(s => {
      totalFee += s.fee;
      s.payments.forEach(p => {
        totalIncome += p.amount;
        if (p.date === today) {
            dailyIncome += p.amount;
        }
      });
    });

    // Calculate Expense
    expenses.forEach(e => {
        totalExpense += e.amount;
        if (e.date === today) {
            dailyExpense += e.amount;
        }
    });

    const totalDue = totalFee - totalIncome;
    const netProfit = totalIncome - totalExpense;

    return {
      count: students.length,
      income: totalIncome,
      expense: totalExpense,
      profit: netProfit,
      due: totalDue,
      dailyIncome,
      dailyExpense
    };
  }, [students, expenses]);

  const chartData = [
    { name: 'Total Income', value: stats.income, color: '#22c55e' },
    { name: 'Total Expense', value: stats.expense, color: '#f97316' }, 
    { name: 'Net Profit', value: stats.profit, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-semibold mb-1">মোট ছাত্র</p>
              <h3 className="text-3xl font-bold text-blue-600">{stats.count}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-semibold mb-1">মোট আয় (Income)</p>
              <h3 className="text-3xl font-bold text-green-600">৳ {stats.income.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-semibold mb-1">মোট ব্যয় (Expense)</p>
              <h3 className="text-3xl font-bold text-orange-600">৳ {stats.expense.toLocaleString()}</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-semibold mb-1">নিট লাভ (Profit)</p>
              <h3 className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                ৳ {stats.profit.toLocaleString()}
              </h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Wallet className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Stats & Due */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Summary */}
        <div className="md:col-span-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 text-white">
            <h4 className="flex items-center gap-2 text-xl font-bold mb-4 border-b border-gray-600 pb-2">
                <Calendar /> আজকের হিসাব (Daily Cash)
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">আজকের আয়</p>
                    <p className="text-2xl font-bold text-green-400">৳ {stats.dailyIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">আজকের ব্যয়</p>
                    <p className="text-2xl font-bold text-red-400">৳ {stats.dailyExpense.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-gray-300 text-sm">হাতে আছে (Cash In Hand)</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        ৳ {(stats.dailyIncome - stats.dailyExpense).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>

        {/* Total Due */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="flex justify-between items-center h-full">
            <div>
              <p className="text-gray-500 font-semibold mb-1">মোট বকেয়া (Total Due)</p>
              <h3 className="text-3xl font-bold text-red-600">৳ {stats.due.toLocaleString()}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">আর্থিক সারাংশ গ্রাফ</h4>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => `৳ ${value.toLocaleString()}`} 
              />
              <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};