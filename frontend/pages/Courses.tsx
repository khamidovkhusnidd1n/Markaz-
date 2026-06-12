import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const typeGradients: Record<string, string> = {
  retraining: 'from-blue-700 to-cyan-500',
  professional_development: 'from-emerald-700 to-teal-500',
  short_professional_development: 'from-amber-600 to-orange-500',
  profession_learning: 'from-fuchsia-700 to-rose-500',
};

const Courses: React.FC = () => {
  const { courses } = useApp();

  return (
    <div className="bg-slate-50">
      <section className="bg-[linear-gradient(135deg,#082f49,#0f172a_45%,#1d4ed8)] text-white">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">Kurslar</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
            Markazda mavjud kurslar va yo'nalishlar
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200">
            Admin panel orqali qo'shilgan barcha kurslar shu sahifada ko'rinadi. Kartani ochib kurs tavsiloti va aloqa ma'lumotlarini ko'rishingiz mumkin.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`h-48 bg-gradient-to-br ${typeGradients[course.type] || 'from-slate-700 to-slate-500'}`}>
                  {course.photoUrl ? (
                    <img src={course.photoUrl} alt={course.title} className="h-full w-full object-cover opacity-90" />
                  ) : (
                    <div className="flex h-full items-end p-6 text-white">
                      <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]">
                        {course.typeDisplay || 'Kurs'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">{course.typeDisplay || 'Kurs'}</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{course.title}</h2>
                  </div>
                  {course.description && (
                    <p className="max-h-[4.5rem] overflow-hidden text-sm leading-6 text-slate-600">{course.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-slate-500">
                    {course.phoneNumbers && <p className="flex items-center gap-2"><Phone size={16} /> {course.phoneNumbers}</p>}
                    {course.email && <p className="flex items-center gap-2"><Mail size={16} /> {course.email}</p>}
                    {course.telegramLink && <p className="flex items-center gap-2"><Send size={16} /> Telegram mavjud</p>}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-blue-700">
                    Batafsil ko'rish <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-300 bg-white px-6 py-20 text-center text-slate-500">
            Hozircha kurslar kiritilmagan.
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
