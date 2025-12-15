import React from 'react';
import { Wrench } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-lg border-b-4 border-yellow-400">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <Wrench className="w-8 h-8 text-yellow-400" />
          গুজিয়া টেকনিক্যাল ট্রেনিং সেন্টার
        </h1>
        <p className="text-blue-100 text-lg">স্টুডেন্ট ম্যানেজমেন্ট ও হিসাব-নিকাশ সফটওয়্যার</p>
      </div>
    </div>
  );
};