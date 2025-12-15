import { useState, useEffect } from 'react';
import { Student, Payment, Expense, PaymentMethod } from '../types';

const DB_KEY = 'gttc_students_db';
const EXPENSE_DB_KEY = 'gttc_expenses_db';

// --- DEMO DATA GENERATORS ---
const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const LAST_WEEK = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
const LAST_MONTH = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

const DEMO_STUDENTS: Student[] = [
  {
    id: 'GTTC-1001',
    name: 'মোঃ রহিম উদ্দিন',
    mobile: '01712345678',
    course: 'Computer Office App',
    fee: 5000,
    admissionDate: LAST_MONTH,
    payments: [
      { amount: 2000, date: LAST_MONTH, method: 'Cash', category: 'Admission Fee' },
      { amount: 3000, date: TODAY, method: 'Bkash', category: 'Monthly Fee' }
    ]
  },
  {
    id: 'GTTC-1002',
    name: 'মোসাঃ ফাতেমা বেগম',
    mobile: '01812345678',
    course: 'Graphics Design',
    fee: 8000,
    admissionDate: LAST_MONTH,
    payments: [
      { amount: 4000, date: LAST_MONTH, method: 'Cash', category: 'Admission Fee' }
    ]
  },
  {
    id: 'GTTC-1003',
    name: 'আব্দুল করিম',
    mobile: '01912345678',
    course: 'Electrical Wiring',
    fee: 6000,
    admissionDate: YESTERDAY,
    payments: [
      { amount: 1000, date: YESTERDAY, method: 'Nagad', category: 'Admission Fee' }
    ]
  }
];

const DEMO_EXPENSES: Expense[] = [
  {
    id: '1',
    category: 'Office Rent',
    amount: 5000,
    date: LAST_MONTH,
    description: 'Office rent for last month',
    method: 'Cash'
  },
  {
    id: '2',
    category: 'Internet Bill',
    amount: 1000,
    date: YESTERDAY,
    description: 'Broadband bill',
    method: 'Bkash'
  }
];

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const storedData = localStorage.getItem(DB_KEY);
      if (storedData) {
         const parsed = JSON.parse(storedData);
         return parsed.length > 0 ? parsed : DEMO_STUDENTS;
      }
      return DEMO_STUDENTS;
    } catch (e) {
      console.error("Failed to load students", e);
      return DEMO_STUDENTS;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const storedExpenses = localStorage.getItem(EXPENSE_DB_KEY);
      if (storedExpenses) {
          const parsed = JSON.parse(storedExpenses);
          return parsed.length > 0 ? parsed : DEMO_EXPENSES;
      }
      return DEMO_EXPENSES;
    } catch (e) {
      console.error("Failed to load expenses", e);
      return DEMO_EXPENSES;
    }
  });

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(EXPENSE_DB_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addStudent = (studentData: Omit<Student, 'payments'>, initialPayment: number = 0, paymentMethod: PaymentMethod = 'Cash'): string | null => {
    const exists = students.some(s => s.id.toLowerCase() === studentData.id.toLowerCase());
    if (exists) return null; 

    const payments: Payment[] = initialPayment > 0 
      ? [{ amount: initialPayment, date: studentData.admissionDate, method: paymentMethod, category: 'Admission Fee' }]
      : [];
    
    const newStudent: Student = { ...studentData, payments };
    setStudents(prev => [...prev, newStudent]);
    return studentData.id;
  };

  const addPayment = (studentId: string, payment: Payment): boolean => {
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return false;

    const updatedStudents = [...students];
    updatedStudents[studentIndex] = {
      ...updatedStudents[studentIndex],
      payments: [...updatedStudents[studentIndex].payments, payment]
    };
    setStudents(updatedStudents);
    return true;
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই ছাত্রের ডাটা ডিলিট করতে চান?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই খরচটি মুছে ফেলতে চান?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const importData = (data: { students: Student[], expenses: Expense[] }): boolean => {
    if (window.confirm('সতর্কতা: বর্তমান ডেটা নতুন আপলোড করা ডেটা দ্বারা প্রতিস্থাপন করা হবে। আপনি কি নিশ্চিত?')) {
      setStudents(data.students || []);
      setExpenses(data.expenses || []);
      return true;
    }
    return false;
  };

  const resetData = (): boolean => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিতভাবে সমস্ত ডেটা রিসেট করতে চান?')) {
       setStudents(DEMO_STUDENTS);
       setExpenses(DEMO_EXPENSES);
       return true;
    }
    return false;
  };

  return {
    students,
    expenses,
    addStudent,
    addPayment,
    deleteStudent,
    addExpense,
    deleteExpense,
    importData,
    resetData
  };
};