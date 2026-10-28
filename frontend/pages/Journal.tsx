import React, { useState } from 'react';
import { Eye, Share2 } from 'lucide-react';
import DocumentViewer from '../components/DocumentViewer';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

interface BoardMember {
  name: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
}

const EDITORIAL_BOARD: BoardMember[] = [
  {
    name: "Kamola Akilova",
    titleUz: "San'atshunoslik fanlari doktori, professor",
    titleRu: "Доктор искусствоведения, профессор",
    titleEn: "Doctor of Art Studies, Professor",
  },
  {
    name: "Surayyo Aliyeva",
    titleUz: "San'atshunoslik fanlari doktori (DSc), professor",
    titleRu: "Доктор искусствоведения (DSc), профессор",
    titleEn: "Doctor of Art Studies (DSc), Professor",
  },
  {
    name: "Dilafruz Qodirova",
    titleUz: "San'atshunoslik fanlari doktori, professor",
    titleRu: "Доктор искусствоведения, профессор",
    titleEn: "Doctor of Art Studies, Professor",
  },
  {
    name: "Munisa Muhamedova",
    titleUz: "Tarix fanlari doktori (DSc), professor",
    titleRu: "Доктор исторических наук (DSc), профессор",
    titleEn: "Doctor of Historical Sciences (DSc), Professor",
  },
  {
    name: "Dilafruz Qurbonova",
    titleUz: "Tarix fanlari doktori (DSc), dotsent",
    titleRu: "Доктор исторических наук (DSc), доцент",
    titleEn: "Doctor of Historical Sciences (DSc), Associate Professor",
  },
  {
    name: "Bahromjon Inatullayev",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD), professor",
    titleRu: "Доктор философии (PhD) по искусствоведению, профессор",
    titleEn: "PhD in Art Studies, Professor",
  },
  {
    name: "Dilzoda Alimkulova",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD), dotsent",
    titleRu: "Доктор философии (PhD) по искусствоведению, доцент",
    titleEn: "PhD in Art Studies, Associate Professor",
  },
  {
    name: "Nigora Kultasheva",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
  {
    name: "Latofat Jabborova",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
  {
    name: "Komiljon Gulyamov",
    titleUz: "Pedagogika fanlari doktori (DSc)",
    titleRu: "Доктор педагогических наук (DSc)",
    titleEn: "Doctor of Pedagogical Sciences (DSc)",
  },
  {
    name: "Xolmuhammad Amonov",
    titleUz: "Pedagogika fanlari doktori (DSc)",
    titleRu: "Доктор педагогических наук (DSc)",
    titleEn: "Doctor of Pedagogical Sciences (DSc)",
  },
  {
    name: "Muhayyo Jumaniyozova",
    titleUz: "Pedagogika fanlari doktori (DSc)",
    titleRu: "Доктор педагогических наук (DSc)",
    titleEn: "Doctor of Pedagogical Sciences (DSc)",
  },
  {
    name: "Muzaffarjon Jo'rayev",
    titleUz: "Pedagogika fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по педагогическим наукам",
    titleEn: "PhD in Pedagogical Sciences",
  },
  {
    name: "Shixnazar Jumaniyazov",
    titleUz: "Pedagogika fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по педагогическим наукам",
    titleEn: "PhD in Pedagogical Sciences",
  },
  {
    name: "Gulabza Qarshiyeva",
    titleUz: "Filologiya fanlari nomzodi",
    titleRu: "Кандидат филологических наук",
    titleEn: "Candidate of Philological Sciences",
  },
  {
    name: "Valiyev Soxibjon",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
  {
    name: "Mamatqosimova Nodira",
    titleUz: "Pedagogika fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по педагогическим наукам",
    titleEn: "PhD in Pedagogical Sciences",
  },
  {
    name: "Mamatqulov Bexzod",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
  {
    name: "Mufti-zade Gulchehra",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
];

const PUBLIC_COUNCIL: BoardMember[] = [
  {
    name: "Akmal Nuridinov",
    titleUz: "O'zbekiston Badiiy akademiyasi akademigi, professor",
    titleRu: "Академик Академии художеств Узбекистана, профессор",
    titleEn: "Academician of the Academy of Arts of Uzbekistan, Professor",
  },
  {
    name: "Rustam Xudoyberganov",
    titleUz: "Professor",
    titleRu: "Профессор",
    titleEn: "Professor",
  },
  {
    name: "Feruza Abidjanova",
    titleUz: "Falsafa fanlari nomzodi",
    titleRu: "Кандидат философских наук",
    titleEn: "Candidate of Philosophical Sciences",
  },
  {
    name: "Binafsha Nodir",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
  {
    name: "Dilnoza Jamolitdinova",
    titleUz: "Filologiya fanlari doktori, professor",
    titleRu: "Доктор филологических наук, профессор",
    titleEn: "Doctor of Philological Sciences, Professor",
  },
  {
    name: "Qiu Qi (Xitoy)",
    titleUz: "San'atshunoslik fanlari nomzodi",
    titleRu: "Кандидат искусствоведения",
    titleEn: "Candidate of Art Studies",
  },
  {
    name: "Jang Tae Mook (Janubiy Koreya)",
    titleUz: "Professor",
    titleRu: "Профессор",
    titleEn: "Professor",
  },
  {
    name: "Kavita Daryani Rao (Hindiston)",
    titleUz: "Professor",
    titleRu: "Профессор",
    titleEn: "Professor",
  },
  {
    name: "Natik Aliyev (Ozarbayjon)",
    titleUz: "Professor",
    titleRu: "Профессор",
    titleEn: "Professor",
  },
  {
    name: "Wei Xuyu (Xitoy)",
    titleUz: "Professor",
    titleRu: "Профессор",
    titleEn: "Professor",
  },
  {
    name: "Yang Yi (Xitoy)",
    titleUz: "Professor",
    titleRu: "Профессор",
    titleEn: "Professor",
  },
];

const Journal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { journalIssues, journalSettings } = useApp();
  const [viewDoc, setViewDoc] = useState<string | null>(null);
  const [boardTab, setBoardTab] = useState<'editorial' | 'council'>('editorial');

  const lang = (i18n.language || 'uz').substring(0, 2);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = params.get('id');
    if (id && journalIssues.length > 0) {
      const issue = journalIssues.find(i => i.id.toString() === id);
      if (issue) {
        setViewDoc(issue.pdfUrl);
      }
    }
  }, [journalIssues]);

  const handleShare = (issueId: number) => {
    const shareUrl = `https://uzbamalaka.uz/api/s/journal/${issueId}/`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert(t('news.journal_share_copied')))
      .catch(err => console.error('Xatolik:', err));
  };

  const getMemberTitle = (m: BoardMember) => {
    if (lang === 'ru') return m.titleRu;
    if (lang === 'en') return m.titleEn;
    return m.titleUz;
  };

  const localizeCountryInName = (name: string) => {
    if (lang === 'uz') return name;
    const map: Record<string, { ru: string; en: string }> = {
      "(Xitoy)": { ru: "(Китай)", en: "(China)" },
      "(Janubiy Koreya)": { ru: "(Южная Корея)", en: "(South Korea)" },
      "(Hindiston)": { ru: "(Индия)", en: "(India)" },
      "(Ozarbayjon)": { ru: "(Азербайджан)", en: "(Azerbaijan)" },
    };
    let res = name;
    for (const [k, v] of Object.entries(map)) {
      if (res.includes(k)) {
        res = res.replace(k, lang === 'ru' ? v.ru : v.en);
      }
    }
    return res;
  };

  const editorialTitle = lang === 'ru'
    ? "Члены редакционной коллегии"
    : lang === 'en'
    ? "Editorial Board Members"
    : "Tahrir hay'ati a'zolari";

  const councilTitle = lang === 'ru'
    ? "Члены общественного совета"
    : lang === 'en'
    ? "Public Council Members"
    : "Jamoatchilik kengashi a'zolari";

  const activeList = boardTab === 'editorial' ? EDITORIAL_BOARD : PUBLIC_COUNCIL;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-900 py-8 text-white">
        <div className="container mx-auto px-4 sm:px-10">
          <div className="w-full">
            <h1 className="mb-6 text-3xl md:text-5xl font-bold">{t('journal.title')}</h1>
            <div 
              className="text-base md:text-lg leading-relaxed text-blue-100 text-justify space-y-4 [&>p]:mb-4"
              dangerouslySetInnerHTML={{ __html: journalSettings.aboutJournal || t('journal.about_fallback') }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-16 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <h2 className="border-b pb-4 text-3xl font-bold text-gray-900">{t('journal.issues_title')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {journalIssues.length > 0 ? journalIssues.map((issue) => (
              <div key={issue.id} className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-colors hover:border-blue-300">
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                  <img src={issue.thumbnailUrl || 'https://picsum.photos/seed/doc/100/140'} alt={`${t('journal.issue_alt')} ${issue.year}`} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700">{t('journal.issue_label')} {issue.year}</h3>
                    <p className="text-sm text-gray-500">{issue.issueNumber || issue.year}</p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button onClick={() => {
                      setViewDoc(issue.pdfUrl);
                      window.location.hash = `#/journal?id=${issue.id}`;
                    }} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"><Eye size={14} /> {t('common.view')}</button>
                    <button onClick={(e) => { e.stopPropagation(); handleShare(issue.id); }} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"><Share2 size={14} /> {t('common.share')}</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full rounded-2xl border-2 border-dashed py-12 text-center text-gray-500">
                {t('journal.no_issues')}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Tahrir hay'ati va Jamoatchilik kengashi */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setBoardTab('editorial')}
                className={`px-3 py-3.5 text-xs font-bold uppercase tracking-wide transition-colors border-b-2 ${
                  boardTab === 'editorial'
                    ? 'border-blue-900 bg-white text-blue-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {editorialTitle}
              </button>
              <button
                type="button"
                onClick={() => setBoardTab('council')}
                className={`px-3 py-3.5 text-xs font-bold uppercase tracking-wide transition-colors border-b-2 ${
                  boardTab === 'council'
                    ? 'border-blue-900 bg-white text-blue-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {councilTitle}
              </button>
            </div>

            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {boardTab === 'editorial' ? editorialTitle : councilTitle}
              </h3>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                {activeList.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {activeList.map((member, index) => (
                <div key={index} className="px-5 py-3 hover:bg-slate-50/80 transition-colors flex items-baseline gap-3">
                  <span className="text-xs font-semibold text-slate-400 w-5 shrink-0 tabular-nums">
                    {index + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-snug">
                      {localizeCountryInName(member.name)}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {getMemberTitle(member)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-6">
            <h3 className="mb-4 text-xl font-bold text-amber-900">{t('journal.for_authors_title')}</h3>
              <div 
                className="text-sm text-amber-950 mb-4 space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: journalSettings.articleRulesText || t('journal.for_authors_fallback') }}
              />
            {journalSettings.articleRulesPdfUrl && (
              <button onClick={() => setViewDoc(journalSettings.articleRulesPdfUrl)} className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-xs md:text-sm font-semibold text-white transition-colors hover:bg-amber-800 shadow-sm"><Eye size={16} /> {t('common.view')}</button>
            )}
          </div>
        </div>
      </div>
      {viewDoc && <DocumentViewer url={viewDoc} onClose={() => {
        setViewDoc(null);
        window.location.hash = '#/journal';
      }} />}
    </div>
  );
};

export default Journal;
