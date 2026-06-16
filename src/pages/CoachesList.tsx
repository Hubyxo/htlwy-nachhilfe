import React, { useState, useEffect } from 'react';
import { ChevronDown, CalendarPlus, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X, Search, GraduationCap, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CoachDetail from '../components/CoachDetail';

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

interface BookingState {
  coachId: string;
  status: 'loading' | 'success' | 'error' | 'no_account' | 'self';
}

interface SubjectModalState {
  tutor: Tutor;
  selected: string;
  blockedSubjects: string[];
  loadingBlocked: boolean;
}

const CoachesList: React.FC = () => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<Tutor | null>(null);
  const [bookingState, setBookingState] = useState<BookingState | null>(null);
  const [subjectModal, setSubjectModal] = useState<SubjectModalState | null>(null);

  const departmentColors: Record<string, { bg: string; text: string }> = {
    'Informationstechnologie': { bg: '#ec7404', text: '#fff' },
    'Maschinenbau': { bg: '#e63233', text: '#fff' },
    'Wirtschaftsingenieure': { bg: '#13509f', text: '#fff' },
    'Elektrotechnik': { bg: '#fec601', text: '#000' },
    'Mechatronik': { bg: '#97c81e', text: '#fff' },
  };

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data, error } = await supabase
          .from('tutors')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCoaches(data || []);
      } catch (err) {
        console.error('Fehler beim Laden der Coaches:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const filteredCoaches = selectedDepartment
    ? coaches.filter((coach) => coach.department === selectedDepartment)
    : coaches;

  const openBookingModal = async (tutor: Tutor) => {
    setSubjectModal({ tutor, selected: tutor.subjects[0] || '', blockedSubjects: [], loadingBlocked: true });
    if (!user) return;
    try {
      const { data: coachUser } = await supabase
        .from('users').select('id').eq('email', tutor.email).maybeSingle();
      if (!coachUser) { setSubjectModal((prev) => prev ? { ...prev, loadingBlocked: false } : null); return; }

      const { data: coachProfile } = await supabase
        .from('coach_profiles').select('id').eq('user_id', coachUser.id).maybeSingle();
      if (!coachProfile) { setSubjectModal((prev) => prev ? { ...prev, loadingBlocked: false } : null); return; }

      const { data: activeBookings } = await supabase
        .from('bookings').select('subject')
        .eq('student_id', user.id).eq('coach_id', coachProfile.id)
        .in('status', ['pending', 'confirmed']);

      const blocked = (activeBookings || []).map((b) => b.subject as string);
      const firstAvailable = tutor.subjects.find((s) => !blocked.includes(s)) ?? tutor.subjects[0] ?? '';
      setSubjectModal((prev) => prev ? { ...prev, blockedSubjects: blocked, loadingBlocked: false, selected: firstAvailable } : null);
    } catch {
      setSubjectModal((prev) => prev ? { ...prev, loadingBlocked: false } : null);
    }
  };

  const handleBookCoach = async () => {
    if (!user || !subjectModal) return;
    const { tutor, selected, blockedSubjects } = subjectModal;
    if (blockedSubjects.includes(selected)) return;
    setSubjectModal(null);
    setBookingState({ coachId: tutor.id, status: 'loading' });

    try {
      const { data: coachUser } = await supabase
        .from('users').select('id').eq('email', tutor.email).maybeSingle();
      if (!coachUser) { setBookingState({ coachId: tutor.id, status: 'no_account' }); setTimeout(() => setBookingState(null), 4000); return; }
      if (coachUser.id === user.id) { setBookingState({ coachId: tutor.id, status: 'self' }); setTimeout(() => setBookingState(null), 4000); return; }

      const { data: coachProfile } = await supabase
        .from('coach_profiles').select('id').eq('user_id', coachUser.id).maybeSingle();
      if (!coachProfile) { setBookingState({ coachId: tutor.id, status: 'no_account' }); setTimeout(() => setBookingState(null), 4000); return; }

      const { error: bookingError } = await supabase.from('bookings').insert({
        student_id: user.id, coach_id: coachProfile.id, status: 'pending', subject: selected,
      });
      if (bookingError) throw bookingError;

      await supabase.from('notifications').insert({
        user_id: coachUser.id, type: 'booking_request',
        message: `${user.display_name} hat eine Buchungsanfrage für ${selected} gestellt.`, read: false,
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ to: tutor.email, type: 'booking_request', data: { studentName: user.display_name, studentEmail: user.email, subject: selected } }),
        }).catch((err) => console.error('Email error:', err));
      }

      setBookingState({ coachId: tutor.id, status: 'success' });
      setTimeout(() => setBookingState(null), 4000);
    } catch (err) {
      console.error('Buchungsfehler:', err);
      setBookingState({ coachId: tutor.id, status: 'error' });
      setTimeout(() => setBookingState(null), 4000);
    }
  };

  const getBookingButtonContent = (tutor: Tutor) => {
    if (!bookingState || bookingState.coachId !== tutor.id)
      return <><CalendarPlus className="h-4 w-4" />Coach buchen</>;
    if (bookingState.status === 'loading')
      return <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sende...</>;
    if (bookingState.status === 'success')
      return <><CheckCircle className="h-4 w-4" />Gesendet!</>;
    if (bookingState.status === 'no_account')
      return <><AlertCircle className="h-4 w-4" />Kein Konto</>;
    if (bookingState.status === 'self')
      return <><AlertCircle className="h-4 w-4" />Nicht buchbar</>;
    return <><AlertCircle className="h-4 w-4" />Fehler</>;
  };

  const getBookingButtonStyle = (tutor: Tutor) => {
    const base = 'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold';
    if (!bookingState || bookingState.coachId !== tutor.id)
      return `${base} bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md`;
    if (bookingState.status === 'loading') return `${base} bg-blue-400 text-white cursor-not-allowed`;
    if (bookingState.status === 'success') return `${base} bg-emerald-600 text-white cursor-default`;
    if (bookingState.status === 'self') return `${base} bg-gray-400 text-white cursor-default`;
    return `${base} bg-red-500 text-white cursor-default`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <GraduationCap size={20} className="text-blue-300" />
            </div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Coaches</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Nachhilfecoaches</h1>
          <p className="text-blue-100/60 text-lg max-w-xl">
            Finde den perfekten Coach für dein Fach — direkt buchbar von Mitschüler zu Mitschüler.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
              <SlidersHorizontal size={16} />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="relative flex-1 min-w-0">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer bg-white text-sm transition-all"
              >
                <option value="">Alle Abteilungen</option>
                {Object.keys(departmentColors).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {selectedDepartment && (
              <button
                onClick={() => setSelectedDepartment('')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
              >
                <X size={14} />
                Filter entfernen
              </button>
            )}
            {!isLoading && (
              <span className="text-sm text-gray-400 flex-shrink-0">
                {filteredCoaches.length} {filteredCoaches.length === 1 ? 'Coach' : 'Coaches'}
              </span>
            )}
          </div>

          {/* Coach grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                    <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Keine Coaches gefunden</p>
              <p className="text-gray-500 text-sm">
                {selectedDepartment
                  ? `Kein Coach aus der Abteilung "${selectedDepartment}". Versuch einen anderen Filter.`
                  : 'Noch keine Coaches registriert.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoaches.map((coach) => {
                const deptColor = departmentColors[coach.department] || { bg: '#6b7280', text: '#fff' };
                return (
                  <div
                    key={coach.id}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
                  >
                    {/* Color strip */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: deptColor.bg }} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: deptColor.bg }}
                          >
                            {coach.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-slate-100 leading-tight">{coach.full_name}</h3>
                            {coach.school_year && (
                              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{coach.school_year}</p>
                            )}
                          </div>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                          style={{ backgroundColor: deptColor.bg + '20', color: deptColor.bg }}
                        >
                          {coach.department.split(' ')[0]}
                        </span>
                      </div>

                      {/* Subjects */}
                      <div className="mb-5 flex-1">
                        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Fächer</p>
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

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                        {user ? (
                          <button
                            onClick={() => openBookingModal(coach)}
                            disabled={bookingState?.coachId === coach.id && bookingState.status === 'loading'}
                            className={getBookingButtonStyle(coach)}
                          >
                            {getBookingButtonContent(coach)}
                          </button>
                        ) : (
                          <a
                            href="/login"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-semibold"
                          >
                            <CalendarPlus className="h-4 w-4" />
                            Anmelden zum Buchen
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedCoach(coach)}
                          className="flex-1 px-4 py-2.5 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:border-blue-300 hover:text-blue-700 dark:hover:border-blue-500 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200 text-sm font-semibold"
                        >
                          Mehr Info
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedCoach && (
        <CoachDetail coach={selectedCoach} onClose={() => setSelectedCoach(null)} onBook={(coach) => { setSelectedCoach(null); openBookingModal(coach); }} />
      )}

      {/* Subject selection modal */}
      {subjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Fach auswählen</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Coaching bei <span className="font-medium text-gray-700">{subjectModal.tutor.full_name}</span>
                </p>
              </div>
              <button
                onClick={() => setSubjectModal(null)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-2.5 mb-6">
                {subjectModal.loadingBlocked ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  subjectModal.tutor.subjects.map((subject) => {
                    const isBlocked = subjectModal.blockedSubjects.includes(subject);
                    const isSelected = subjectModal.selected === subject;
                    return (
                      <button
                        key={subject}
                        onClick={() => !isBlocked && setSubjectModal({ ...subjectModal, selected: subject })}
                        disabled={isBlocked}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                          isBlocked
                            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span>{subject}</span>
                          {isBlocked && (
                            <span className="text-xs font-normal text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                              Bereits aktiv
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSubjectModal(null)}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleBookCoach}
                  disabled={!subjectModal.selected || subjectModal.blockedSubjects.includes(subjectModal.selected) || subjectModal.loadingBlocked}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarPlus size={15} />
                  Anfrage senden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachesList;
