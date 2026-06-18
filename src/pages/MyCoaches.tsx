import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { GraduationCap, Mail, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Star, MessageCircle, MessageSquare, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CoachProfile {
  id: string; user_id: string; department: string; class: string;
  subjects: string[]; availability: string; additional_info?: string;
}
interface CoachUser {
  id: string; email: string; display_name: string; profile_image_url?: string;
}
interface BookedCoach {
  bookingId: string; status: string; created_at: string; subject: string | null;
  completed_reason: string | null; coach: CoachProfile; coachUser: CoachUser;
}

interface ExistingRating {
  score: number;
  comment: string | null;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  pending: { label: 'Ausstehend', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: <Clock size={13} className="text-amber-600" /> },
  confirmed: { label: 'Bestätigt', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: <CheckCircle size={13} className="text-emerald-600" /> },
  completed: { label: 'Abgeschlossen', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: <CheckCircle size={13} className="text-blue-600" /> },
  cancelled: { label: 'Storniert', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', icon: <AlertCircle size={13} className="text-gray-400" /> },
};

const departmentColors: Record<string, { bg: string }> = {
  'Informationstechnologie': { bg: '#ec7404' }, 'Maschinenbau': { bg: '#e63233' },
  'Wirtschaftsingenieure': { bg: '#13509f' }, 'Elektrotechnik': { bg: '#fec601' }, 'Mechatronik': { bg: '#97c81e' },
};

const StarPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={32}
            className={`transition-colors ${s <= (hovered || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
          />
        </button>
      ))}
    </div>
  );
};

const MyCoaches: React.FC = () => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<BookedCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingRatings, setExistingRatings] = useState<Record<string, ExistingRating>>({});
  const [ratingModal, setRatingModal] = useState<{ bookingId: string; coachId: string; coachName: string } | null>(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchMyCoaches = async () => {
      try {
        const { data: bookings, error } = await supabase.from('bookings')
          .select('id, coach_id, status, created_at, completed_reason, subject')
          .eq('student_id', user.id).in('status', ['confirmed', 'completed'])
          .order('created_at', { ascending: false });
        if (error || !bookings) return;

        const result = await Promise.all(
          bookings.map(async (booking) => {
            const { data: coach } = await supabase.from('coach_profiles').select('*').eq('id', booking.coach_id).maybeSingle();
            const coachUser = coach
              ? await supabase.from('users').select('id, email, display_name, profile_image_url').eq('id', coach.user_id).maybeSingle().then(({ data }) => data)
              : null;
            return {
              bookingId: booking.id, status: booking.status, created_at: booking.created_at,
              subject: booking.subject ?? null, completed_reason: booking.completed_reason ?? null,
              coach: coach || ({} as CoachProfile),
              coachUser: coachUser || { id: '', email: '', display_name: 'Unbekannt' },
            };
          })
        );
        setCoaches(result);

        // Fetch existing ratings for completed bookings
        const completedIds = bookings.filter((b) => b.status === 'completed').map((b) => b.id);
        if (completedIds.length > 0) {
          const { data: ratings } = await supabase.from('ratings').select('booking_id, score, comment')
            .in('booking_id', completedIds);
          if (ratings) {
            const map: Record<string, ExistingRating> = {};
            ratings.forEach((r) => { map[r.booking_id] = { score: r.score, comment: r.comment }; });
            setExistingRatings(map);
          }
        }
      } catch (err) { console.error('Error fetching coaches:', err); }
      finally { setLoading(false); }
    };
    fetchMyCoaches();
  }, [user]);

  const openRatingModal = (bookingId: string, coachId: string, coachName: string) => {
    setRatingScore(0);
    setRatingComment('');
    setRatingModal({ bookingId, coachId, coachName });
  };

  const handleSubmitRating = async () => {
    if (!user || !ratingModal || ratingScore === 0) return;
    setRatingSubmitting(true);
    try {
      const { error } = await supabase.from('ratings').insert({
        booking_id: ratingModal.bookingId,
        student_id: user.id,
        coach_id: ratingModal.coachId,
        score: ratingScore,
        comment: ratingComment.trim() || null,
      });
      if (error) throw error;
      setExistingRatings((prev) => ({
        ...prev,
        [ratingModal.bookingId]: { score: ratingScore, comment: ratingComment.trim() || null },
      }));
      setRatingModal(null);
    } catch (err) { console.error('Rating error:', err); }
    finally { setRatingSubmitting(false); }
  };

  if (!user) return <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center"><p className="text-gray-500">Bitte melde dich an.</p></div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid-dark" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <GraduationCap size={20} className="text-blue-300" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Meine Coaches</h1>
            <p className="text-blue-100/60">Coaches, die deine Buchungsanfrage angenommen haben</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-200" />
                    <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-1/3 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : coaches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">Noch keine Coaches gebucht</p>
              <p className="text-gray-400 text-sm">
                Besuche die{' '}
                <Link to="/nachhilfecoaches" className="text-blue-600 hover:underline">Coaches-Seite</Link>
                {' '}und buche deinen ersten Coach.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {coaches.map((entry) => {
                const cfg = statusConfig[entry.status] || statusConfig.cancelled;
                const deptColor = departmentColors[entry.coach.department] || { bg: '#6b7280' };
                const existingRating = existingRatings[entry.bookingId];
                const isCompleted = entry.status === 'completed';
                return (
                  <div key={entry.bookingId} className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="h-1 w-full" style={{ backgroundColor: deptColor.bg }} />
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {entry.coachUser.profile_image_url ? (
                            <img src={entry.coachUser.profile_image_url} alt={entry.coachUser.display_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ backgroundColor: deptColor.bg }}>
                              {entry.coachUser.display_name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{entry.coachUser.display_name}</h3>
                              {entry.coach.department && (
                                <span className="px-2 py-0.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: deptColor.bg + '20', color: deptColor.bg }}>
                                  {entry.coach.department.split(' ')[0]}
                                </span>
                              )}
                              {entry.subject && (
                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                                  {entry.subject}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{entry.coachUser.email}</p>
                            {entry.coach.subjects?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {entry.coach.subjects.map((s) => (
                                  <span key={s} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">{s}</span>
                                ))}
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                              {entry.coach.class && <span className="text-xs text-gray-500"><span className="font-medium">Klasse:</span> {entry.coach.class}</span>}
                              <span className="text-xs text-gray-400">Gebucht am {new Date(entry.created_at).toLocaleDateString('de-DE')}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.icon}{cfg.label}
                        </span>
                      </div>

                      {entry.status === 'confirmed' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <MessageCircle size={14} className="text-blue-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-600">Schreib <span className="font-medium">{entry.coachUser.display_name}</span> eine E-Mail:</p>
                            <a href={`mailto:${entry.coachUser.email}`} className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium mt-0.5">
                              <Mail size={12} />{entry.coachUser.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          {entry.completed_reason && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MessageSquare size={13} className="text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Abschlusskommentar</p>
                                <p className="text-sm text-gray-600 italic">"{entry.completed_reason}"</p>
                              </div>
                            </div>
                          )}

                          {existingRating ? (
                            <div className="flex items-center gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                              <div>
                                <p className="text-xs font-semibold text-amber-700 mb-1">Deine Bewertung</p>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} className={s <= existingRating.score ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                                  ))}
                                </div>
                                {existingRating.comment && (
                                  <p className="text-xs text-gray-500 mt-1 italic">"{existingRating.comment}"</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => openRatingModal(entry.bookingId, entry.coach.id, entry.coachUser.display_name)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-sm font-semibold rounded-xl transition-colors"
                            >
                              <Star size={14} className="fill-amber-400 text-amber-400" />
                              Bewertung abgeben
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rating modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Star size={20} className="text-amber-500 fill-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">Coaching bewerten</h2>
                <p className="text-sm text-gray-500">mit {ratingModal.coachName}</p>
              </div>
              <button onClick={() => setRatingModal(null)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 mb-5">
              <StarPicker value={ratingScore} onChange={setRatingScore} />
              <p className="text-sm text-gray-400">
                {ratingScore === 0 ? 'Klicke auf einen Stern' : ['', 'Schlecht', 'Nicht gut', 'Ok', 'Gut', 'Ausgezeichnet'][ratingScore]}
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kommentar <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Was hat dir am Coaching gut oder weniger gut gefallen?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                Abbrechen
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={ratingScore === 0 || ratingSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star size={14} className="fill-white" />
                {ratingSubmitting ? 'Speichern...' : 'Bewertung senden'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCoaches;
