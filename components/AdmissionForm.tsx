import React, { useState } from 'react';
import { COURSES, PaymentMethod, Student } from '../types';
import { UserPlus, Save, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AdmissionFormProps {
  onAddStudent: (data: any, initialPayment?: number, paymentMethod?: PaymentMethod) => string | null;
  students: Student[];
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ onAddStudent, students }) => {
  const [formData, setFormData] = useState({
    id: '', 
    name: '',
    mobile: '',
    course: COURSES[0] as string,
    fee: '',
    paid: '',
    paymentMethod: 'Cash' as PaymentMethod,
    date: new Date().toISOString().split('T')[0]
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.mobile || !formData.fee) return;

    // Pass the manual ID along with other data
    const resultId = onAddStudent({
      id: formData.id.trim(), 
      name: formData.name,
      mobile: formData.mobile,
      course: formData.course,
      fee: parseFloat(formData.fee),
      admissionDate: formData.date
    }, parseFloat(formData.paid) || 0, formData.paymentMethod);

    if (resultId) {
        setSuccessMessage(`সফলভাবে ভর্তি হয়েছে! আইডি: ${resultId}`);
        
        // Reset form
        setFormData({
          id: '',
          name: '',
          mobile: '',
          course: COURSES[0],
          fee: '',
          paid: '',
          paymentMethod: 'Cash',
          date: new Date().toISOString().split('T')[0]
        });

        // Hide success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
    } else {
        alert(`ত্রুটি: "${formData.id}" আইডিটি ইতিমধ্যে ব্যবহৃত হয়েছে। দয়া করে অন্য আইডি দিন।`);
    }
  };

  // Get last 5 added students (assuming new ones are appended to the end)
  const recentStudents = [...students].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white font-bold text-lg flex items-center gap-2">
          <UserPlus size={20} />
          নতুন ছাত্র ভর্তি ফরম
        </div>
        
        <div className="p-6">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3 text-green-800 animate-fade-in">
              <CheckCircle size={24} className="text-green-600" />
              <span className="font-bold text-lg">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               {/* ID Input Field */}
               <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-2">স্টুডেন্ট আইডি (Student ID)</label>
                <div className="relative">
                  <input
                      type="text"
                      required
                      className="w-full border-2 border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-800"
                      placeholder="উদাহরণ: CTT-101"
                      value={formData.id}
                      onChange={e => setFormData({ ...formData, id: e.target.value })}
                  />
                  <small className="text-gray-500 mt-1 block flex items-center gap-1">
                      <AlertTriangle size={12} />
                      সতর্কতা: এই আইডিটি ইউনিক হতে হবে (যেমন: রেজিঃ নাম্বার বা রোল)
                  </small>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">ছাত্রের নাম</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="নাম লিখুন"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">মোবাইল নম্বর</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="017xxxxxxxx"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">কোর্সের নাম</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.course}
                  onChange={e => setFormData({ ...formData, course: e.target.value })}
                >
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              {/* Fees Section */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">মোট কোর্স ফি (Total)</label>
                    <input
                      type="number"
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                      value={formData.fee}
                      onChange={e => setFormData({ ...formData, fee: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ভর্তির সময় জমা (Paid)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      value={formData.paid}
                      onChange={e => setFormData({ ...formData, paid: e.target.value })}
                    />
                  </div>
                   <div>
                    <label className="block text-gray-700 font-medium mb-2">পেমেন্ট মেথড</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">ভর্তির তারিখ</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow transition-colors flex justify-center items-center gap-2"
            >
              <Save size={20} />
              ভর্তি নিশ্চিত করুন
            </button>
          </form>
        </div>
      </div>

      {/* Recently Added Students List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
          <Clock className="text-gray-500" size={20} />
          <h3 className="font-bold text-gray-700">সদ্য ভর্তি হওয়া ছাত্র ছাত্রী (Recently Added)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">নাম</th>
                <th className="p-3">মোবাইল</th>
                <th className="p-3">কোর্স</th>
                <th className="p-3">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400">এখনও কোনো ছাত্র ভর্তি হয়নি</td>
                </tr>
              ) : (
                recentStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-3 font-bold text-blue-600">{s.id}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-gray-500">{s.mobile}</td>
                    <td className="p-3">{s.course}</td>
                    <td className="p-3 text-gray-500">{s.admissionDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};