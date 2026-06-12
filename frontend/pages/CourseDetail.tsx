import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const { courses } = useApp();
  const course = courses.find((item) => item.id === id);

  if (!course) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Kurs topilmadi</h1>
          <p className="mt-3 text-slate-500">So'ralgan kurs mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
          <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-bold text-white">
            <ChevronLeft size={18} /> Kurslar sahifasiga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-6 py-10">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
          <ChevronLeft size={18} /> Barcha kurslar
        </Link>
      </div>

      <section className="container mx-auto grid gap-8 px-6 pb-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="h-80 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">
            {course.photoUrl ? (
              <img src={course.photoUrl} alt={course.title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">{course.typeDisplay || 'Kurs'}</p>
            <h1 className="mt-3 text-4xl font-black text-slate-900">{course.title}</h1>
            {course.duration && <p className="mt-3 text-sm font-medium text-slate-500">Davomiyligi: {course.duration}</p>}
            <div className="mt-8">
              <h2 className="text-xl font-black text-slate-900">Kurs tavsiloti</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {course.description || "Kurs tavsiloti hali kiritilmagan."}
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Aloqa ma'lumotlari</p>
          <div className="mt-6 space-y-4">
            {course.phoneNumbers && <p className="flex items-start gap-3 text-slate-700"><Phone size={18} className="mt-1 text-blue-700" /> <span>{course.phoneNumbers}</span></p>}
            {course.email && <p className="flex items-start gap-3 text-slate-700"><Mail size={18} className="mt-1 text-blue-700" /> <span>{course.email}</span></p>}
            {course.telegramLink && (
              <a href={course.telegramLink} target="_blank" rel="noreferrer" className="flex items-start gap-3 text-slate-700 hover:text-blue-700">
                <Send size={18} className="mt-1 text-blue-700" /> <span>{course.telegramLink}</span>
              </a>
            )}
            {!course.phoneNumbers && !course.email && !course.telegramLink && (
              <p className="text-slate-500">Aloqa ma'lumotlari hali kiritilmagan.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CourseDetail;
