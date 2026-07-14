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
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                <img 
                  src={teacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz'} 
                  alt={teacher.fullName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-6 text-center flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                    {teacher.fullName}
                  </h3>
                  <p className="text-emerald-600 font-bold text-sm uppercase tracking-wide mb-1">
                    {teacher.position_translated || teacher.position}
                  </p>
                </div>
                {(teacher.degree || teacher.title) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-1">
                    {teacher.degree && (
                      <div>
                        <span className="font-semibold text-slate-400">Ilmiy darajasi:</span>{' '}
                        <span className="text-slate-700 font-medium">{teacher.degree_translated || teacher.degree}</span>
                      </div>
                    )}
                    {teacher.title && (
                      <div>
                        <span className="font-semibold text-slate-400">Unvoni:</span>{' '}
                        <span className="text-slate-700 font-medium">{teacher.title_translated || teacher.title}</span>
                      </div>
                    )}
                  </div>
                )}
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
