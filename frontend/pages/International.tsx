import React from 'react';
import { Globe, Image as ImageIcon, PlayCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const International: React.FC = () => {
  const {
    internationalSettings,
    internationalPartners,
    internationalProjects,
    internationalMedia,
  } = useApp();

  const photos = internationalMedia.filter((item) => item.mediaType === 'photo');
  const videos = internationalMedia.filter((item) => item.mediaType === 'video');

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-sky-700 to-indigo-900 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Globe size={16} />
              Xalqaro hamkorlik
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              {internationalSettings.heroTitle || 'Xalqaro aloqalar'}
            </h1>
            <p className="text-lg text-blue-100">
              {internationalSettings.heroDescription || "Markazning xalqaro hamkorlik faoliyati shu bo'limda yoritiladi."}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-3xl font-black text-slate-900">Bo'lim haqida</h2>
          <p className="whitespace-pre-wrap text-slate-600">
            {internationalSettings.aboutText || "Bo'lim matni hali kiritilmagan."}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">Xorijiy hamkorlar</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {internationalPartners.length > 0 ? internationalPartners.map((partner) => (
            <div key={partner.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
                {partner.photoUrl ? (
                  <img src={partner.photoUrl} alt={partner.name} className="h-full w-full object-cover" />
                ) : (
                  <Globe className="text-blue-600" size={28} />
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900">{partner.name}</h3>
              <p className="mb-3 text-sm font-semibold text-blue-700">{partner.country}</p>
              <p className="mb-4 text-sm text-slate-600">{partner.description}</p>
            </div>
          )) : (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
              Hamkorlar kiritilmagan
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">Loyihalar</h2>
        </div>
        <div className="space-y-5">
          {internationalProjects.length > 0 ? internationalProjects.map((project) => (
            <div key={project.id} className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-black text-slate-900">{project.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${project.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {project.statusDisplay || (project.status === 'ongoing' ? 'Davom etmoqda' : 'Yakunlangan')}
                </span>
              </div>
              <p className="mb-4 text-slate-600">{project.description}</p>
              {project.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {project.images.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-2xl bg-slate-100">
                      <img src={image.imageUrl} alt={project.title} className="h-32 w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-3 flex flex-wrap gap-2">
                {project.partners.map((partner) => (
                  <span key={partner} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {partner}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Boshlangan sana: {project.startDate}
                {project.endDate ? ` | Tugash sana: ${project.endDate}` : ''}
              </p>
            </div>
          )) : (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
              Loyihalar kiritilmagan
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">Fotosuratlar</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.length > 0 ? photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-[1.5rem] bg-white shadow-sm">
              {photo.imageUrl ? (
                <img src={photo.imageUrl} alt={photo.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100">
                  <ImageIcon className="text-slate-400" size={36} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <p className="font-bold">{photo.title}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
              Foto materiallar kiritilmagan
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">Videolar</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {videos.length > 0 ? videos.map((video) => (
            <a
              key={video.id}
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <PlayCircle size={28} />
              </div>
              <h3 className="mb-2 text-xl font-black text-slate-900">{video.title}</h3>
              <p className="mb-4 text-sm text-slate-600">{video.description}</p>
              <span className="text-sm font-bold text-red-600">Videoni ochish</span>
            </a>
          )) : (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
              Video materiallar kiritilmagan
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default International;
