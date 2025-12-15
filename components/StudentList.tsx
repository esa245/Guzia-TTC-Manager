import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Eye, Trash2, X } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobile.includes(searchTerm) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-800 p-4 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Search size={20} />
          ছাত্র খুজুন ও বিস্তারিত দেখুন
        </h2>
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            className="w-full text-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="নাম, মোবাইল বা আইডি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">নাম & মোবাইল</th>
              <th className="p-4 border-b">কোর্স</th>
              <th className="p-4 border-b text-center">মোট ফি</th>
              <th className="p-4 border-b text-center">জমা</th>
              <th className="p-4 border-b text-center">বকেয়া</th>
              <th className="p-4 border-b text-center">স্ট্যাটাস</th>
              <th className="p-4 border-b text-center">একশন</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">কোনো তথ্য পাওয়া যায়নি</td>
              </tr>
            ) : (
              filteredStudents.map((s, index) => {
                const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
                const due = s.fee - totalPaid;
                const isPaid = due <= 0;

                return (
                  <tr key={s.id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                    <td className="p-4 font-bold text-blue-600">{s.id}</td>
                    <td className="p-4">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.mobile}</div>
                    </td>
                    <td className="p-4 text-sm">{s.course}</td>
                    <td className="p-4 text-center font-medium">৳ {s.fee}</td>
                    <td className="p-4 text-center text-green-600 font-bold">৳ {totalPaid}</td>
                    <td className="p-4 text-center text-red-600 font-bold">৳ {due > 0 ? due : 0}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isPaid ? 'PAID' : 'DUE'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(s.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded shadow transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Details */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">ছাত্রের বিস্তারিত তথ্য</h3>
              <button onClick={() => setSelectedStudent(null)} className="hover:bg-blue-600 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <span className="text-gray-500 text-sm">নাম</span>
                    <p className="font-bold text-lg">{selectedStudent.name}</p>
                  </div>
                   <div>
                    <span className="text-gray-500 text-sm">আইডি</span>
                    <p className="font-bold text-lg text-blue-600">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">কোর্স</span>
                    <p className="font-medium">{selectedStudent.course}</p>
                  </div>
                   <div>
                    <span className="text-gray-500 text-sm">মোবাইল</span>
                    <p className="font-medium">{selectedStudent.mobile}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">ভর্তি তারিখ</span>
                    <p className="font-medium">{selectedStudent.admissionDate}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>মোট ফি:</span>
                    <span className="font-bold">৳ {selectedStudent.fee}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>জমা দিয়েছে:</span>
                    <span className="font-bold">
                      ৳ {selectedStudent.payments.reduce((sum, p) => sum + p.amount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600 border-t border-gray-200 pt-2">
                    <span>বকেয়া:</span>
                    <span className="font-bold">
                       ৳ {Math.max(0, selectedStudent.fee - selectedStudent.payments.reduce((sum, p) => sum + p.amount, 0))}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 mb-2">টাকা জমার ইতিহাস</h4>
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    {selectedStudent.payments.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500 text-center">কোনো টাকা জমা দেয়নি</p>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-xs uppercase">
                          <tr>
                            <th className="p-2">তারিখ</th>
                            <th className="p-2 text-right">পরিমাণ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudent.payments.map((p, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="p-2">{p.date}</td>
                              <td className="p-2 text-right font-bold">৳ {p.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-4 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};