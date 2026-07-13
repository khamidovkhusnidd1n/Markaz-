import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Teachers: React.FC = () => {
  const { teachers } = useApp();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Jamoa</span>
          <h1 className="text-4xl md:text-5xl font-black">Bizning ustozlar</h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl">Yuqori malakali mutaxassislar va tajribali pedagoglar jamoasi</p>
        </div>
      </div>
      
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teachers.length > 0 ? teachers.map((teacher) => (
            <div 
              key={teacher.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={teacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz'} 
                  alt={teacher.fullName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-emerald-400 font-bold text-sm mb-1">{teacher.experience} yillik tajriba</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                  {teacher.fullName}
                </h3>
                <p className="text-emerald-600 font-bold text-sm uppercase tracking-wide">
                  {teacher.specialty}
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg">Hozircha ustozlar haqida ma'lumot kiritilmagan</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Teachers;
