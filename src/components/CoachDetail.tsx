import React, { useEffect, useState } from 'react';
import { X, BookOpen, Clock, Info, CalendarPlus, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tutor {
  id: string;
  full_name: string;
  email: string;
  department: string;
  subjects: string[];
  school_year: string;
  availability: string | null;
  additional_info: string | null;
}

interface CoachDetailProps {
  coach: Tutor;
  onClose: () => void;
  onBook: (coach: Tutor) => void;
}

const departmentColors: Record<string, { bg: string; text: string }> = {
  'Informationstechnologie': { bg: '#ec7404', text: '#fff' },
  'Maschinenbau': { bg: '#e63233', text: '#fff' },
  'Wirtschaftsingenieure': { bg: '#13509f', text: '#fff' },
  'Elektrotechnik': { bg: '#fec601', text: '#000' },
  'Mechatronik': { bg: '#97c81e', text: '#fff' },
};

const StarDisplay: React.FC<{ value: number; size?: number }> = ({ value, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
  </div>
);

const CoachDetail: React.FC<CoachDetailProps> = ({ coach, onClose, onBook }) => {
  const deptColor = departmentColors[coach.department] || { bg: '#6b7280', text: '#fff' };
  const [avgRating, setAvgRating] = useState<{ score: number; count: number } | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      const { data: coachUser } = await supabase.from('users').select('id').eq('email', coach.email).maybeSingle();
      if (!coachUser) return;
      const { data: coachProfile } = await supabase.from('coach_profiles').select('id').eq('user_id', coachUser.id).maybeSingle();
      if (!coachProfile) return;
      const { data: rows } = await supabase.from('ratings').select('score').eq('coach_id', coachProfile.id);
      if (rows && rows.length > 0) {
        const avg = rows.reduce((sum, r) => sum + r.score, 0) / rows.length;
        setAvgRating({ score: avg, count: rows.length });
      }
    };
    fetchRating();
  }, [coach.email]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">

        {/* Color strip */}
        <div className="h-1.5 w-full" style={{ backgroundColor: deptColor.bg }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: deptColor.bg, color: deptColor.text }}
            >
              {coach.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 leading-tight">
                {coach.full_name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {coach.school_year && (
                  <p className="text-sm text-gray-400 dark:text-slate-500">{coach.school_year}</p>
                )}
                {avgRating && (
                  <div className="flex items-center gap-1.5">
                    <StarDisplay value={avgRating.score} size={12} />
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {avgRating.score.toFixed(1)} ({avgRating.count})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: deptColor.bg + '20', color: deptColor.bg }}
            >
              {coach.department.split(' ')[0]}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={18} className="text-gray-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-100 dark:border-slate-700" />

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">

          {/* Subjects */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <BookOpen size={13} className="text-gray-400 dark:text-slate-500" />
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Fächer</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {coach.subjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-block px-2.5 py-1 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-100 dark:border-blue-500/30"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          {coach.availability && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={13} className="text-gray-400 dark:text-slate-500" />
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Verfügbarkeit</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {coach.availability}
              </p>
            </div>
          )}

          {/* Additional info */}
          {coach.additional_info && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info size={13} className="text-gray-400 dark:text-slate-500" />
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Weitere Infos</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {coach.additional_info}
              </p>
            </div>
          )}

          {/* Rating block */}
          {avgRating && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={13} className="text-gray-400 dark:text-slate-500" />
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Bewertung</p>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl px-4 py-3">
                <span className="text-2xl font-black text-gray-900 dark:text-slate-100">{avgRating.score.toFixed(1)}</span>
                <div>
                  <StarDisplay value={avgRating.score} size={16} />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Basierend auf {avgRating.count} {avgRating.count === 1 ? 'Bewertung' : 'Bewertungen'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — booking */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={() => { onClose(); onBook(coach); }}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <CalendarPlus size={15} />
            Coach buchen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachDetail;
