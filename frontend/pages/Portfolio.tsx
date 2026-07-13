import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, ArrowLeft, Clock } from 'lucide-react';

const Portfolio: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <div className="bg-gradient-to-r from-violet-700 to-violet-900 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Portfolio</h1>
          <p className="text-violet-200 text-lg">Tinglovchilar uchun shaxsiy portfolio tizimi.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-violet-100 to-violet-200 rounded-3xl flex items-center justify-center animate-pulse">
            <FolderOpen size={48} className="text-violet-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tez kunda ishga tushadi</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Portfolio tizimi hozirda ishlab chiqilmoqda. Bu yerda tinglovchilar o'z yutuqlari, sertifikatlari va loyihalarini saqlashlari mumkin bo'ladi.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-violet-700 bg-violet-50 px-4 py-2 rounded-full">
            <Clock size={16} />
            Ishga tushirish rejalashtirilmoqda
          </div>
          <div className="mt-10">
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white rounded-xl hover:bg-violet-800 transition-colors font-medium">
              <ArrowLeft size={18} /> Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
