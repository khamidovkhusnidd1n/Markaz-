import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

import { stripHtml } from '../utils';

const typeGradients: Record<string, string> = {
  retraining: 'from-slate-900 to-blue-900',
  professional_development: 'from-blue-900 to-indigo-900',
  short_professional_development: 'from-slate-800 to-blue-800',
  profession_learning: 'from-indigo-950 to-slate-800',
};

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const { courses } = useApp();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-14">
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">{t('courses.badge')}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight md:text-4xl tracking-tight">
            {t('courses.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            {t('courses.subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-blue-300 hover:shadow-md flex flex-col"
              >
                <div className={`h-40 bg-gradient-to-br ${typeGradients[course.type] || 'from-slate-800 to-slate-900'} shrink-0`}>
                  {course.photoUrl ? (
                    <img src={course.photoUrl} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-end p-5 text-white">
                      <span className="rounded-lg bg-white/15 border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                        {course.typeDisplay || t('courses.course_fallback')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3.5 p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{course.typeDisplay || t('courses.course_fallback')}</p>
                    <h2 className="mt-1.5 text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">{course.title}</h2>
                    {course.description && (
                      <p className="mt-2 line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-600">{stripHtml(course.description)}</p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="space-y-1.5 text-xs text-slate-500">
                      {course.phoneNumbers && <p className="flex items-center gap-2"><Phone size={14} /> {course.phoneNumbers}</p>}
                      {course.email && <p className="flex items-center gap-2"><Mail size={14} /> {course.email}</p>}
                      {course.telegramLink && <p className="flex items-center gap-2"><Send size={14} /> {t('courses.telegram_available')}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 pt-1">
                      {t('courses.view_details')} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center text-slate-500">
            {t('courses.no_courses')}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
