import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Send, Globe, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const CourseDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { courses } = useApp();
  const course = courses.find((item) => String(item.id) === id);

  if (!course) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">{t('course_detail.not_found_title')}</h1>
          <p className="mt-3 text-slate-500">{t('course_detail.not_found_desc')}</p>
          <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-bold text-white">
            <ChevronLeft size={18} /> {t('course_detail.back_to_courses')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-6 py-10">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
          <ChevronLeft size={18} /> {t('course_detail.all_courses')}
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
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">{course.typeDisplay || t('courses.course_fallback')}</p>
            <h1 className="mt-3 text-4xl font-black text-slate-900">{course.title}</h1>
            {course.duration && <p className="mt-3 text-sm font-medium text-slate-500">{t('course_detail.duration')}: {course.duration}</p>}
            <div className="mt-8">
              <h2 className="text-xl font-black text-slate-900">{t('course_detail.details_title')}</h2>
              <div 
                className="mt-3 leading-7 text-slate-600 prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description || t('course_detail.no_details') }}
              />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
            {t('course_detail.contact_info', "ALOQA MA'LUMOTLARI")}
          </p>
          <div className="flex flex-col gap-3">
            {/* Phone */}
            <a href="tel:+998773633836" className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-slate-400">{t('social.phone')}</span>
                <span className="font-semibold text-slate-800 transition-colors group-hover:text-emerald-700">+998 77 363 38 36</span>
              </div>
            </a>

            {/* Website */}
            <a href="https://uzbamalaka.uz/" target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 transition-transform group-hover:scale-110">
                <Globe size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-slate-400">{t('social.website')}</span>
                <span className="font-semibold text-slate-800 transition-colors group-hover:text-cyan-700">uzbamalaka.uz</span>
              </div>
            </a>

            {/* Telegram */}
            <a href="https://t.me/uzba_markaz" target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-sky-200 hover:bg-sky-50 hover:shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-500 transition-transform group-hover:scale-110">
                <Send size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-slate-400">{t('social.telegram')}</span>
                <span className="font-semibold text-slate-800 transition-colors group-hover:text-sky-600">{t('social.official_channel')}</span>
              </div>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/Uzba.huzuridagi.markaz" target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                <Facebook size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-slate-400">{t('social.facebook')}</span>
                <span className="font-semibold text-slate-800 transition-colors group-hover:text-blue-700">{t('social.visit_page')}</span>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/uzba.huzuridagi.markaz" target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-pink-200 hover:bg-pink-50 hover:shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-100 via-pink-100 to-fuchsia-100 text-pink-600 transition-transform group-hover:scale-110">
                <Instagram size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-slate-400">{t('social.instagram')}</span>
                <span className="font-semibold text-slate-800 transition-colors group-hover:text-pink-600">{t('social.visit_page')}</span>
              </div>
            </a>
            
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CourseDetail;
