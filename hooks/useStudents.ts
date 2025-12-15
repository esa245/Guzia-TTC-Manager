import { useState, useEffect } from 'react';
import { Student, Payment, Expense, PaymentMethod } from '../types';

const DB_KEY = 'gttc_students_db';
const EXPENSE_DB_KEY = 'gttc_expenses_db';

// --- DEMO DATA GENERATORS ---
const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TWO_DAYS_AGO = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
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
  },
  {
    id: 'GTTC-1004',
    name: 'সুমাইয়া আক্তার',
    mobile: '01612345678',
    course: 'Computer Office App',
    fee: 5000,
    admissionDate: TODAY,
    payments: [
      { amount: 5000, date: TODAY, method: 'Cash', category: 'Admission Fee' }
    ]
  },
  {
    id: 'GTTC-1005',
    name: 'রফিকুল ইসলাম',
    mobile: '01512345678',
    course: 'Driving & Auto Mechanics',
    fee: 10000,
    admissionDate: TODAY,
    payments: []
  },
  {
    id: 'GTTC-1006',
    name: 'আরিফ হোসেন',
    mobile: '01312345678',
    course: 'Plumbing',
    fee: 7000,
    admissionDate: LAST_WEEK,
    payments: [
       { amount: 2000, date: LAST_WEEK, method: 'Cash', category: 'Admission Fee' }
    ]
  },
  {
    id: 'GTTC-1007',
    name: 'নুসরাত জাহান',
    mobile: '01412345678',
    course: 'Graphics Design',
    fee: 8000,
    admissionDate: TWO_DAYS_AGO,
    payments: [
       { amount: 8000, date: TWO_DAYS_AGO, method: 'Bkash', category: 'Admission Fee' }
    ]
  },
  {
    id: 'GTTC-1008',
    name: 'কামাল হাসান',
    mobile: '01799887766',
    course: 'Computer Office App',
    fee: 5000,
    admissionDate: LAST_MONTH,
    payments: [
      { amount: 1000, date: LAST_MONTH, method: 'Cash', category: 'Admission Fee' },
      { amount: 500, date: LAST_WEEK, method: 'Rocket', category: 'Monthly Fee' }
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
  },
  {
    id: '3',
    category: 'Tea & Entertainment',
    amount: 250,
    date: TODAY,
    description: 'Guests tea and snacks',
    method: 'Cash'
  },
  {
    id: '4',
    category: 'Printing & Stationery',
    amount: 500,
    date: TODAY,
    description: 'Paper and Toner',
    method: 'Cash'
  },
  {
    id: '5',
    category: 'Electricity Bill',
    amount: 1200,
    date: LAST_WEEK,
    description: 'Monthly electricity bill',
    method: 'Nagad'
  },
  {
    id: '6',
    category: 'Marketing',
    amount: 2000,
    date: TWO_DAYS_AGO,
    description: 'Facebook Ad Boost',
    method: 'Bank'
  }
];

export const useStudents = () => {
  // Initialize state from localStorage OR fallback to DEMO DATA
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

  // Save to local storage whenever students change
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(students));
  }, [students]);

  // Save expenses whenever they change
  useEffect(() => {
    localStorage.setItem(EXPENSE_DB_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addStudent = (studentData: Omit<Student, 'payments'>, initialPayment: number = 0, paymentMethod: PaymentMethod = 'Cash'): string | null => {
    
    // Check if ID already exists (Case insensitive check)
    const exists = students.some(s => s.id.toLowerCase() === studentData.id.toLowerCase());
    if (exists) {
        return null; 
    }

    // Create initial payment if amount is greater than 0
    const payments: Payment[] = initialPayment > 0 
      ? [{ 
          amount: initialPayment, 
          date: studentData.admissionDate,
          method: paymentMethod,
          category: 'Admission Fee'
        }]
      : [];
    
    const newStudent: Student = {
      ...studentData,
      payments: payments
    };
    
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

  // Expense Functions
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই খরচটি মুছে ফেলতে চান?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  // Backup & Restore Functions
  const importData = (data: { students: Student[], expenses: Expense[] }): boolean => {
    if (window.confirm('সতর্কতা: বর্তমান ডেটা নতুন আপলোড করা ডেটা দ্বারা প্রতিস্থাপন করা হবে। আপনি কি নিশ্চিত?')) {
      
      const validStudents = Array.isArray(data.students) ? data.students : [];
      const validExpenses = Array.isArray(data.expenses) ? data.expenses : [];

      setStudents(validStudents);
      setExpenses(validExpenses);

      localStorage.setItem(DB_KEY, JSON.stringify(validStudents));
      localStorage.setItem(EXPENSE_DB_KEY, JSON.stringify(validExpenses));

      return true;
    }
    return false;
  };

  const resetData = (): boolean => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিতভাবে সমস্ত ডেটা ডিলিট করতে চান?')) {
       // Reset to DEMO data instead of empty for full demo experience
       setStudents(DEMO_STUDENTS);
       setExpenses(DEMO_EXPENSES);
       localStorage.removeItem(DB_KEY);
       localStorage.removeItem(EXPENSE_DB_KEY);
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