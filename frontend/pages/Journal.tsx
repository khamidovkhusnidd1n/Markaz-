import React, { useState } from 'react';
import { Eye, Share2, Download } from 'lucide-react';
import DocumentViewer from '../components/DocumentViewer';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { sanitizeHtml } from '../utils';

interface BoardMember {
  name: string;
  roleUz?: string;
  roleRu?: string;
  roleEn?: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
}

const CHIEF_EDITORS: BoardMember[] = [
  {
    name: "Davronbek Shukurov",
    roleUz: "Bosh muharrir",
    roleRu: "Главный редактор",
    roleEn: "Editor-in-Chief",
    titleUz: "San'atshunoslik fanlari falsafa doktori (PhD)",
    titleRu: "Доктор философии (PhD) по искусствоведению",
    titleEn: "PhD in Art Studies",
  },
  {
    name: "Nodira Xasanova",
    roleUz: "Bosh muharrir o'rinbosari",
    roleRu: "Заместитель главного редактора",
    roleEn: "Deputy Editor-in-Chief",
    titleUz: "",
    titleRu: "",
    titleEn: "",
  },
];

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
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const getCleanYear = (yearStr?: string) => {
    const match = (yearStr || '').match(/\d{4}/);
    return match ? match[0] : (yearStr || '').replace(/-?\s*yil/gi, '').trim();
  };

  const formatIssueTitle = (issue: any) => {
    const cleanYear = getCleanYear(issue.year);
    if (lang === 'ru') return `${t('journal.issue_label')} ${cleanYear} г.`;
    if (lang === 'en') return `${t('journal.issue_label')} ${cleanYear}`;
    return `${t('journal.issue_label')} ${cleanYear}-yil`;
  };

  const formatIssueNumber = (issue: any) => {
    const match = (issue.issueNumber || '').match(/\d+/);
    if (match) {
      const num = match[0];
      if (lang === 'ru') return `№ ${num} ${t('journal.issue_number_suffix')}`;
      if (lang === 'en') return `${t('journal.issue_number_suffix')} ${num}`;
      return `${num}-son`;
    }
    return issue.issueNumber || issue.year;
  };

  const availableYears = React.useMemo(() => {
    const years = new Set<string>();
    journalIssues.forEach(item => {
      const y = getCleanYear(item.year);
      if (y) years.add(y);
    });
    return Array.from(years).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  }, [journalIssues]);

  const sortedAndFilteredIssues = React.useMemo(() => {
    let list = [...journalIssues];
    if (selectedYear !== 'all') {
      list = list.filter(item => getCleanYear(item.year) === selectedYear);
    }
    return list.sort((a, b) => {
      const aYear = parseInt(getCleanYear(a.year), 10) || 0;
      const bYear = parseInt(getCleanYear(b.year), 10) || 0;
      if (bYear !== aYear) return bYear - aYear;

      const aIssueMatch = (a.issueNumber || '').match(/\d+/);
      const bIssueMatch = (b.issueNumber || '').match(/\d+/);
      const aIssue = aIssueMatch ? parseInt(aIssueMatch[0], 10) : 0;
      const bIssue = bIssueMatch ? parseInt(bIssueMatch[0], 10) : 0;
      if (bIssue !== aIssue) return bIssue - aIssue;

      return Number(b.id) - Number(a.id);
    });
  }, [journalIssues, selectedYear]);

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

  const getMemberRole = (m: BoardMember) => {
    if (lang === 'ru') return m.roleRu;
    if (lang === 'en') return m.roleEn;
    return m.roleUz;
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
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(journalSettings.aboutJournal || t('journal.about_fallback')) }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-16 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-900">{t('journal.issues_title')}</h2>
            {availableYears.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedYear('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedYear === 'all'
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi'}
                </button>
                {availableYears.map(yr => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedYear === yr
                        ? 'bg-blue-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sortedAndFilteredIssues.length > 0 ? sortedAndFilteredIssues.map((issue) => (
              <div key={issue.id} className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-slate-100">
                  <img src={issue.thumbnailUrl || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140"><rect width="100" height="140" fill="%231e3a8a"/><rect x="10" y="12" width="80" height="116" fill="none" stroke="%23fbbf24" stroke-width="1.5" opacity="0.6"/><text x="50" y="65" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodeURIComponent(t('journal.issue_label').toUpperCase())}</text><text x="50" y="84" font-family="sans-serif" font-size="7.5" fill="%2393c5fd" text-anchor="middle">${encodeURIComponent(t('common.center_short'))}</text></svg>`} alt={`${formatIssueTitle(issue)} ${formatIssueNumber(issue)}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">{formatIssueTitle(issue)}</h3>
                    <p className="text-sm font-semibold text-blue-600 mt-1">{formatIssueNumber(issue)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <button onClick={() => {
                      setViewDoc(issue.pdfUrl);
                      window.location.hash = `#/journal?id=${issue.id}`;
                    }} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"><Eye size={14} /> {t('common.view')}</button>
                    <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 hover:underline"><Download size={14} /> {t('common.download')}</a>
                    <button onClick={(e) => { e.stopPropagation(); handleShare(issue.id); }} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-blue-600 hover:underline"><Share2 size={14} /> {t('common.share')}</button>
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
          {/* Asosiy 1-2: Bosh muharrir va Bosh muharrir o'rinbosari */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-200">
              {CHIEF_EDITORS.map((editor, idx) => (
                <div key={idx} className="px-5 py-4 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                      {getMemberRole(editor)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {editor.name}
                  </p>
                  {getMemberTitle(editor) && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {getMemberTitle(editor)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(journalSettings.articleRulesText || t('journal.for_authors_fallback')) }}
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
