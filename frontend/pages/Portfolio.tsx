import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, Mail, Phone, Calendar, Clock, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Portfolio: React.FC = () => {
  const { personnel, internationalProjects } = useApp();
  const [activeTab, setActiveTab] = useState<'team' | 'projects'>('team');

  // Filter personnel by categories
  const leadership = personnel.filter(p => p.category === 'leadership');
  const staff = personnel.filter(p => p.category === 'staff');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-200 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Portfolio va Loyihalar</h1>
          <p className="text-violet-200 text-lg max-w-2xl font-light">
            Markaz jamoasining shaxsiy portfoliolari va hamkorlikdagi xalqaro loyihalar ro'yxati.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 bg-white p-2 rounded-xl shadow-sm max-w-md">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'team'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users size={18} />
            Bizning Jamoa
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'projects'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase size={18} />
            Xalqaro Loyihalar
          </button>
        </div>

        {/* Tab Content: Team Portfolios */}
        {activeTab === 'team' && (
          <div className="space-y-12">
            {/* Leadership Section */}
            {leadership.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-violet-600 pl-3">
                  Rahbariyat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {leadership.map((person) => (
                    <div key={person.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                      <div className="h-48 bg-gradient-to-r from-violet-100 to-indigo-100 relative flex items-center justify-center">
                        {person.photoUrl ? (
                          <img src={person.photoUrl} alt={person.fullName} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover absolute -bottom-6" />
                        ) : (
                          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-violet-500 text-white flex items-center justify-center text-3xl font-bold absolute -bottom-6">
                            {person.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="pt-10 p-6 flex-grow flex flex-col text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{person.fullName}</h3>
                        <p className="text-sm text-violet-600 font-semibold mb-4">{person.position}</p>
                        
                        {person.biography && (
                          <p className="text-xs text-gray-500 line-clamp-3 mb-4 text-left italic">
                            "{person.biography}"
                          </p>
                        )}

                        <div className="mt-auto space-y-2 border-t pt-4 text-left text-xs text-gray-600">
                          {person.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-400" />
                              <span>{person.phone}</span>
                            </div>
                          )}
                          {person.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-400" />
                              <span>{person.email}</span>
                            </div>
                          )}
                          {person.receptionHours && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-gray-400" />
                              <span>Qabul soatlari: {person.receptionHours}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Central Apparat Section */}
            {staff.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-3">
                  Markaziy Apparat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {staff.map((person) => (
                    <div key={person.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-start gap-4 mb-4">
                          {person.photoUrl ? (
                            <img src={person.photoUrl} alt={person.fullName} className="w-16 h-16 rounded-full object-cover border" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                              {person.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900">{person.fullName}</h3>
                            <p className="text-xs text-indigo-600 font-semibold mt-1">{person.position}</p>
                          </div>
                        </div>

                        {person.duties && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Vazifalari:</p>
                            <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap">{person.duties}</p>
                          </div>
                        )}

                        <div className="mt-auto space-y-2 border-t pt-4 text-xs text-gray-500">
                          {person.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              <span>{person.phone}</span>
                            </div>
                          )}
                          {person.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              <span>{person.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {personnel.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Jamoa a'zolari ma'lumotlari mavjud emas.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: International Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {internationalProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6">
                  {project.images && project.images.length > 0 ? (
                    <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden shrink-0">
                      <img src={project.images[0].imageUrl} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full md:w-64 h-48 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100">
                      <Briefcase size={36} className="text-violet-500" />
                    </div>
                  )}
                  <div className="flex-grow flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : project.status === 'ongoing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {project.statusDisplay || (project.status === 'completed' ? 'Yakunlangan' : 'Davom etmoqda')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 border-t pt-4">
                      {project.partnersText && (
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-violet-600" />
                          <span><strong>Hamkorlar:</strong> {project.partnersText}</span>
                        </div>
                      )}
                      {project.startDate && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-violet-600" />
                          <span>
                            <strong>Boshlangan:</strong> {project.startDate}
                            {project.endDate && ` — Tugallangan: ${project.endDate}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {internationalProjects.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Loyiha portfoliolari hamkorlarimiz bilan yuklanmoqda.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
