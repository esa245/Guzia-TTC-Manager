import { useState } from 'react';
import { Student, Payment, Expense, PaymentMethod } from '../types';

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
  // Initialize directly with Demo Data, removed localStorage logic
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [expenses, setExpenses] = useState<Expense[]>(DEMO_EXPENSES);

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

  return {
    students,
    expenses,
    addStudent,
    addPayment,
    deleteStudent,
    addExpense,
    deleteExpense
  };
};