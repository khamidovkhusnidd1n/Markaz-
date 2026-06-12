import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NewsList: React.FC = () => {
  const { news } = useApp();

  return (
    <div className="bg-slate-50">
      <section className="bg-[linear-gradient(135deg,#0f172a,#172554_45%,#2563eb)] text-white">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-200">Yangiliklar</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">Barcha yangiliklar</h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Markazning barcha yangiliklari sana bo'yicha saralangan holda shu sahifada jamlangan.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-56 overflow-hidden bg-slate-200">
                  <img
                    src={item.images?.[0]?.imageUrl || item.image || '/placeholder.jpg'}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="flex items-center gap-2 text-sm text-slate-400"><Calendar size={16} /> {item.date}</p>
                  <h2 className="mt-3 text-2xl font-black text-slate-900 transition-colors group-hover:text-blue-700">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.content}</p>
                  <div className="mt-5 flex items-center gap-2 font-bold text-blue-700">
                    Batafsil <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-300 bg-white px-6 py-20 text-center text-slate-500">
            Yangiliklar hali kiritilmagan.
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsList;
