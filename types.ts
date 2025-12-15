export type PaymentMethod = 'Cash' | 'Bkash' | 'Nagad' | 'Rocket' | 'Bank';

export interface Payment {
  amount: number;
  date: string;
  method: PaymentMethod;
  category: string; // e.g., Admission Fee, Monthly Fee, Exam Fee
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  method: PaymentMethod;
}

export interface Student {
  id: string;
  name: string;
  mobile: string;
  course: string;
  fee: number;
  admissionDate: string;
  payments: Payment[];
}

export const COURSES = [
  "Computer Office App",
  "Driving & Auto Mechanics",
  "Electrical Wiring",
  "Plumbing",
  "Graphics Design"
] as const;

export const INCOME_CATEGORIES = [
  "Admission Fee",
  "Monthly Fee",
  "Registration Fee",
  "Exam Fee",
  "Certificate Fee",
  "Online Course",
  "Others"
] as const;

export const EXPENSE_CATEGORIES = [
  "Office Rent",
  "Electricity Bill",
  "Internet Bill",
  "Teacher Salary",
  "Staff Salary",
  "Marketing",
  "Printing & Stationery",
  "Equipment Repair",
  "Tea & Entertainment",
  "Others"
] as const;

export type TabType = 'dashboard' | 'admission' | 'payment' | 'expense' | 'database' | 'settings';