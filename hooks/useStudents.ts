import { useState, useEffect } from 'react';
import { Student, Payment, Expense, PaymentMethod } from '../types';

const DB_KEY = 'gttc_students_db';
const EXPENSE_DB_KEY = 'gttc_expenses_db';

export const useStudents = () => {
  // Initialize state directly from localStorage (Lazy Initialization)
  // This prevents empty state from overwriting data on initial render
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const storedData = localStorage.getItem(DB_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
      console.error("Failed to load students", e);
      return [];
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const storedExpenses = localStorage.getItem(EXPENSE_DB_KEY);
      return storedExpenses ? JSON.parse(storedExpenses) : [];
    } catch (e) {
      console.error("Failed to load expenses", e);
      return [];
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
  // Returns true if operation was successful/confirmed
  const importData = (data: { students: Student[], expenses: Expense[] }): boolean => {
    if (window.confirm('সতর্কতা: বর্তমান ডেটা নতুন আপলোড করা ডেটা দ্বারা প্রতিস্থাপন করা হবে। আপনি কি নিশ্চিত?')) {
      
      const validStudents = Array.isArray(data.students) ? data.students : [];
      const validExpenses = Array.isArray(data.expenses) ? data.expenses : [];

      // Update State
      setStudents(validStudents);
      setExpenses(validExpenses);

      // Force Save to LocalStorage immediately to ensure persistence
      localStorage.setItem(DB_KEY, JSON.stringify(validStudents));
      localStorage.setItem(EXPENSE_DB_KEY, JSON.stringify(validExpenses));

      return true;
    }
    return false;
  };

  // Returns true if operation was successful/confirmed
  const resetData = (): boolean => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিতভাবে সমস্ত ডেটা ডিলিট করতে চান? এই কাজ আর ফিরানো যাবে না।')) {
       // Second confirmation
       if(window.confirm('সত্যিই সব ডিলিট করবেন?')) {
          setStudents([]);
          setExpenses([]);
          localStorage.removeItem(DB_KEY);
          localStorage.removeItem(EXPENSE_DB_KEY);
          return true;
       }
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