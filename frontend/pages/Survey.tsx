import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Send,
  AlertCircle,
  Star,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackendAPI } from '../services/backend';

interface SurveyQuestionItem {
  id: number;
  order: number;
  question_type: 'single' | 'multiple' | 'yes_no' | 'rating' | 'likert' | 'text';
  is_required: boolean;
  question_text: string;
  question_text_translated?: string;
  options_json: string[];
  options_translated?: string[];
  has_detail_input: boolean;
  detail_trigger: string;
  detail_trigger_translated?: string;
  detail_label: string;
  detail_label_translated?: string;
}

interface SurveyData {
  id: number;
  title: string;
  title_translated?: string;
  description: string;
  description_translated?: string;
  thanks_message: string;
  thanks_message_translated?: string;
  is_anonymous: boolean;
  allow_multiple: boolean;
  status: string;
  questions_count: number;
  questions: SurveyQuestionItem[];
}

interface QuestionAnswerState {
  selectedOptions: string[];
  textAnswer: string;
  ratingValue: number | null;
}

const TOKEN_STORAGE_KEY = 'uzba_survey_anon_token_v1';
const COMPLETED_SURVEYS_KEY = 'uzba_completed_surveys_v1';

function getOrCreateParticipationToken(): string {
  try {
    const existing = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (existing && existing.length >= 16) return existing;
    const randomPart = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2)).join('');
    const token = `anon_${Date.now()}_${randomPart}`;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    return token;
  } catch {
    return '';
  }
}

function getCompletedSurveyIds(): number[] {
  try {
    const raw = window.localStorage.getItem(COMPLETED_SURVEYS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

function markSurveyCompleted(surveyId: number) {
  try {
    const current = new Set(getCompletedSurveyIds());
    current.add(surveyId);
    window.localStorage.setItem(COMPLETED_SURVEYS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

const Survey: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { courses } = useApp();

  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [missingQuestionId, setMissingQuestionId] = useState<number | null>(null);

  const [courseName, setCourseName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [answers, setAnswers] = useState<Record<number, QuestionAnswerState>>({});

  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    BackendAPI.getSurveys()
      .then((res: any) => {
        if (!mounted) return;
        const list = Array.isArray(res) ? res : (Array.isArray(res?.results) ? res.results : []);
        setSurveys(list);
        if (list.length > 0) {
          setSelectedSurveyId((prev) => (prev && list.some((s) => s.id === prev) ? prev : list[0].id));
        }
      })
      .catch(() => {
        if (mounted) setSurveys([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  const activeSurvey = useMemo(
    () => surveys.find((s) => s.id === selectedSurveyId) || surveys[0] || null,
    [surveys, selectedSurveyId]
  );

  useEffect(() => {
    if (!activeSurvey) return;
    const completedIds = getCompletedSurveyIds();
    const isDone = !activeSurvey.allow_multiple && completedIds.includes(activeSurvey.id);
    setAlreadyCompleted(isDone);
    setSubmittedSuccess(false);
    setErrorMsg(null);
    setMissingQuestionId(null);
    setAnswers({});
  }, [activeSurvey?.id]);

  const questions = useMemo(() => {
    if (!activeSurvey || !Array.isArray(activeSurvey.questions)) return [];
    return [...activeSurvey.questions].sort((a, b) => a.order - b.order);
  }, [activeSurvey]);

  const isQuestionAnswered = (q: SurveyQuestionItem): boolean => {
    const a = answers[q.id];
    if (!a) return false;
    if (q.question_type === 'text') {
      return a.textAnswer.trim().length > 0;
    }
    if (q.question_type === 'rating' || q.question_type === 'likert') {
      return a.ratingValue !== null;
    }
    return a.selectedOptions.length > 0;
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => isQuestionAnswered(q)).length,
    [questions, answers]
  );

  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const updateSingleOption = (qId: number, option: string) => {
    setMissingQuestionId((prev) => (prev === qId ? null : prev));
    setErrorMsg(null);
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOptions: [option],
        textAnswer: prev[qId]?.textAnswer || '',
        ratingValue: prev[qId]?.ratingValue ?? null,
      },
    }));
  };

  const toggleMultiOption = (qId: number, option: string) => {
    setMissingQuestionId((prev) => (prev === qId ? null : prev));
    setErrorMsg(null);
    setAnswers((prev) => {
      const cur = prev[qId]?.selectedOptions || [];
      const next = cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option];
      return {
        ...prev,
        [qId]: {
          selectedOptions: next,
          textAnswer: prev[qId]?.textAnswer || '',
          ratingValue: prev[qId]?.ratingValue ?? null,
        },
      };
    });
  };

  const updateTextAnswer = (qId: number, text: string) => {
    setMissingQuestionId((prev) => (prev === qId ? null : prev));
    setErrorMsg(null);
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOptions: prev[qId]?.selectedOptions || [],
        textAnswer: text,
        ratingValue: prev[qId]?.ratingValue ?? null,
      },
    }));
  };

  const updateRating = (qId: number, score: number) => {
    setMissingQuestionId((prev) => (prev === qId ? null : prev));
    setErrorMsg(null);
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOptions: prev[qId]?.selectedOptions || [],
        textAnswer: prev[qId]?.textAnswer || '',
        ratingValue: score,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurvey) return;

    // Validate required questions
    for (const q of questions) {
      if (q.is_required && !isQuestionAnswered(q)) {
        setMissingQuestionId(q.id);
        setErrorMsg(t('survey.required_error', { order: q.order }));
        const el = questionRefs.current[q.id];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const token = getOrCreateParticipationToken();
      const formattedAnswers = questions.map((q) => {
        const a = answers[q.id] || { selectedOptions: [], textAnswer: '', ratingValue: null };
        return {
          question_id: q.id,
          selected_options: a.selectedOptions,
          text_answer: a.textAnswer.trim(),
          rating_value: a.ratingValue,
        };
      });

      await BackendAPI.submitSurvey(activeSurvey.id, {
        participation_token: token,
        respondent_name: activeSurvey.is_anonymous ? '' : respondentName.trim(),
        course_name: courseName.trim(),
        answers: formattedAnswers,
      });

      markSurveyCompleted(activeSurvey.id);
      setSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> {t('survey.back')}
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <ClipboardCheck size={14} />
              {t('survey.badge')}
            </span>
            {activeSurvey && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                <ShieldCheck size={14} />
                {activeSurvey.is_anonymous ? t('survey.anonymous_badge') : t('survey.open_badge')}
              </span>
            )}
            {activeSurvey && (
              <span className="text-xs text-blue-200 font-semibold">
                • {t('survey.questions_count', { count: questions.length })}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {activeSurvey ? (activeSurvey.title_translated || activeSurvey.title) : t('menu.survey')}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl -mt-6">
        {/* Multiple Survey Selector Tabs (if more than 1 active survey) */}
        {surveys.length > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-6 flex flex-wrap gap-2">
            {surveys.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSurveyId(s.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeSurvey?.id === s.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.title_translated || s.title}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-800" />
            <p className="text-sm font-semibold text-slate-500">{t('common.loading')}</p>
          </div>
        ) : !activeSurvey ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <ClipboardCheck size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-700">{t('survey.no_surveys')}</p>
          </div>
        ) : submittedSuccess ? (
          /* Thank You Confirmation Card */
          <div className="bg-white rounded-3xl shadow-md border border-emerald-200 p-8 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('survey.thanks_title')}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base leading-relaxed whitespace-pre-line">
              {activeSurvey.thanks_message_translated || activeSurvey.thanks_message}
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition-colors shadow-xs"
              >
                <ArrowLeft size={16} />
                {t('survey.back')}
              </Link>
            </div>
          </div>
        ) : alreadyCompleted ? (
          /* Already Participated Card */
          <div className="bg-white rounded-3xl shadow-sm border border-blue-200 p-8 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
              <CheckCircle2 size={34} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('survey.already_submitted_title')}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t('survey.already_submitted_desc')}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                {t('survey.back')}
              </Link>
              <button
                type="button"
                onClick={() => setAlreadyCompleted(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
              >
                {t('survey.fill_again_btn')}
              </button>
            </div>
          </div>
        ) : (
          /* Survey Questionnaire Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Intro & Anonymity Notice Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-amber-500 p-6 sm:p-8 space-y-4">
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                {activeSurvey.description_translated || activeSurvey.description}
              </div>

              {activeSurvey.is_anonymous ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm">
                  <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('survey.anonymous_notice')}</span>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    <UserCheck size={14} className="inline mr-1.5 text-blue-700" />
                    {t('survey.respondent_name_label')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    placeholder={t('survey.respondent_name_placeholder')}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              )}

              {/* Optional Course / Direction Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  <BookOpen size={14} className="inline mr-1.5 text-blue-700" />
                  {t('survey.course_label')}
                </label>
                <input
                  type="text"
                  list="survey-courses-list"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder={t('survey.course_placeholder')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
                <datalist id="survey-courses-list">
                  {courses.map((c) => (
                    <option key={c.id} value={c.title} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Sticky Progress Bar */}
            <div className="sticky top-[72px] z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xs border border-slate-200 px-5 py-3 flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">
                {t('survey.answered_progress', { answered: answeredCount, total: questions.length })}
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 to-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-blue-900 tabular-nums shrink-0">
                {progressPct}%
              </span>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-900 text-sm font-semibold shadow-xs">
                <AlertCircle size={20} className="text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Questions List */}
            {questions.map((q) => {
              const qText = q.question_text_translated || q.question_text;
              const opts =
                q.options_translated && q.options_translated.length > 0
                  ? q.options_translated
                  : q.options_json || [];
              const detailHint = q.detail_label_translated || q.detail_label;
              const triggerOpt = q.detail_trigger_translated || q.detail_trigger;
              const curAns = answers[q.id] || { selectedOptions: [], textAnswer: '', ratingValue: null };
              const isMissing = missingQuestionId === q.id;

              const showConditionalDetail =
                q.has_detail_input &&
                (!triggerOpt ||
                  curAns.selectedOptions.includes(triggerOpt) ||
                  curAns.selectedOptions.includes(q.detail_trigger));

              return (
                <div
                  key={q.id}
                  ref={(el) => {
                    questionRefs.current[q.id] = el;
                  }}
                  className={`bg-white rounded-2xl p-6 sm:p-7 border transition-all shadow-xs ${
                    isMissing
                      ? 'border-rose-400 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-3.5 mb-5">
                    <span className="w-8 h-8 rounded-xl bg-blue-900 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {q.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {qText}
                      </h3>
                      <span
                        className={`inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          q.is_required
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {q.is_required ? `* ${t('survey.required_tag')}` : t('survey.optional_tag')}
                      </span>
                    </div>
                  </div>

                  {/* Single Choice / Yes-No */}
                  {(q.question_type === 'single' || q.question_type === 'yes_no') && (
                    <div className="space-y-2.5 sm:pl-11">
                      {(opts.length > 0 ? opts : [t('survey.yes'), t('survey.no')]).map((opt, oIdx) => {
                        const checked = curAns.selectedOptions.includes(opt);
                        return (
                          <label
                            key={oIdx}
                            onClick={() => updateSingleOption(q.id, opt)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-sm sm:text-base ${
                              checked
                                ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-bold shadow-xs'
                                : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700 font-medium'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              checked={checked}
                              onChange={() => updateSingleOption(q.id, opt)}
                              className="w-4 h-4 accent-blue-700 shrink-0"
                            />
                            <span className="leading-snug">{opt}</span>
                          </label>
                        );
                      })}

                      {showConditionalDetail && (
                        <div className="pt-2 animate-fade-in">
                          {detailHint && (
                            <p className="text-xs font-semibold text-slate-600 mb-1.5">{detailHint}</p>
                          )}
                          <textarea
                            rows={2}
                            value={curAns.textAnswer}
                            onChange={(e) => updateTextAnswer(q.id, e.target.value)}
                            placeholder={detailHint || t('survey.detail_placeholder')}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multiple Choice */}
                  {q.question_type === 'multiple' && (
                    <div className="space-y-2.5 sm:pl-11">
                      {opts.map((opt, oIdx) => {
                        const checked = curAns.selectedOptions.includes(opt);
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-sm sm:text-base ${
                              checked
                                ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-bold shadow-xs'
                                : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700 font-medium'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMultiOption(q.id, opt)}
                              className="w-4 h-4 accent-blue-700 rounded shrink-0"
                            />
                            <span className="leading-snug">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Rating / Likert Scale (1-5) */}
                  {(q.question_type === 'rating' || q.question_type === 'likert') && (
                    <div className="sm:pl-11 flex flex-wrap items-center gap-3">
                      {[1, 2, 3, 4, 5].map((score) => {
                        const active = curAns.ratingValue === score;
                        return (
                          <button
                            key={score}
                            type="button"
                            onClick={() => updateRating(q.id, score)}
                            className={`flex items-center gap-1.5 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                              active
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-105'
                                : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <Star size={16} className={active ? 'fill-white text-white' : 'text-amber-500'} />
                            <span>{score}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Open Text Question */}
                  {q.question_type === 'text' && (
                    <div className="sm:pl-11">
                      {detailHint && (
                        <p className="text-xs font-medium text-slate-500 italic mb-2">{detailHint}</p>
                      )}
                      <textarea
                        rows={3}
                        value={curAns.textAnswer}
                        onChange={(e) => updateTextAnswer(q.id, e.target.value)}
                        placeholder={detailHint || t('survey.text_placeholder')}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Submit Row */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send size={18} />
                <span>{submitting ? t('survey.submitting') : t('survey.submit_btn')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Survey;
