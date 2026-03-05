import React, { useState, useEffect } from 'react';
import { ChevronDown, CalendarPlus, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X } from 'lucide-react';
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
}

const CoachesList: React.FC = () => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
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

  const allSubjects = [
    'Mathematik',
    'Deutsch',
    'Englisch',
    'Physik',
    'Chemie',
    'Geschichte',
    'Geographie',
    'Informationstechnische Fächer',
    'Maschinenbautechnische Fächer',
    'Wirtschaftliche Fächer',
    'Mechatronische Fächer',
    'Elektrotechnische Fächer'
  ];

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

  const filteredCoaches = selectedSubject
    ? coaches.filter((coach) => coach.subjects.includes(selectedSubject))
    : coaches;

  const openBookingModal = (tutor: Tutor) => {
    setSubjectModal({ tutor, selected: tutor.subjects[0] || '' });
  };

  const handleBookCoach = async () => {
    if (!user || !subjectModal) return;
    const { tutor, selected } = subjectModal;
    setSubjectModal(null);

    setBookingState({ coachId: tutor.id, status: 'loading' });

    try {
      const { data: coachUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', tutor.email)
        .maybeSingle();

      if (!coachUser) {
        setBookingState({ coachId: tutor.id, status: 'no_account' });
        setTimeout(() => setBookingState(null), 4000);
        return;
      }

      if (coachUser.id === user.id) {
        setBookingState({ coachId: tutor.id, status: 'self' });
        setTimeout(() => setBookingState(null), 4000);
        return;
      }

      const { data: coachProfile } = await supabase
        .from('coach_profiles')
        .select('id')
        .eq('user_id', coachUser.id)
        .maybeSingle();

      if (!coachProfile) {
        setBookingState({ coachId: tutor.id, status: 'no_account' });
        setTimeout(() => setBookingState(null), 4000);
        return;
      }

      const { error: bookingError } = await supabase.from('bookings').insert({
        student_id: user.id,
        coach_id: coachProfile.id,
        status: 'pending',
        subject: selected,
      });

      if (bookingError) throw bookingError;

      await supabase.from('notifications').insert({
        user_id: coachUser.id,
        type: 'booking_request',
        message: `${user.display_name} hat eine Buchungsanfrage für ${selected} gestellt.`,
        read: false,
      });

      setBookingState({ coachId: tutor.id, status: 'success' });
      setTimeout(() => setBookingState(null), 4000);
    } catch (err) {
      console.error('Buchungsfehler:', err);
      setBookingState({ coachId: tutor.id, status: 'error' });
      setTimeout(() => setBookingState(null), 4000);
    }
  };

  const getBookingButtonContent = (tutor: Tutor) => {
    if (!bookingState || bookingState.coachId !== tutor.id) {
      return (
        <>
          <CalendarPlus className="h-4 w-4" />
          Coach buchen
        </>
      );
    }
    if (bookingState.status === 'loading') {
      return (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Sende...
        </>
      );
    }
    if (bookingState.status === 'success') {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          Gesendet!
        </>
      );
    }
    if (bookingState.status === 'no_account') {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          Kein Konto
        </>
      );
    }
    if (bookingState.status === 'self') {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          Nicht buchbar
        </>
      );
    }
    return (
      <>
        <AlertCircle className="h-4 w-4" />
        Fehler
      </>
    );
  };

  const getBookingButtonStyle = (tutor: Tutor) => {
    const base = 'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium';
    if (!bookingState || bookingState.coachId !== tutor.id) {
      return `${base} bg-blue-600 text-white hover:bg-blue-700`;
    }
    if (bookingState.status === 'loading') return `${base} bg-blue-400 text-white cursor-not-allowed`;
    if (bookingState.status === 'success') return `${base} bg-green-600 text-white cursor-default`;
    if (bookingState.status === 'self') return `${base} bg-gray-400 text-white cursor-default`;
    return `${base} bg-red-500 text-white cursor-default`;
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Unsere Nachhilfecoaches</h1>
            <p className="text-lg text-gray-600">
              Finde den perfekten Coach für deine Fächer
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nach Fach filtern
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer bg-white"
              >
                <option value="">Alle Fächer</option>
                {allSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-gray-600">Coaches werden geladen...</p>
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                {selectedSubject
                  ? `Keine Coaches für das Fach "${selectedSubject}" gefunden.`
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
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{coach.full_name}</h3>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                          style={{ backgroundColor: deptColor.bg, color: deptColor.text }}
                        >
                          {coach.department}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Fächer</p>
                        <div className="flex flex-wrap gap-2">
                          {coach.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      {coach.school_year && (
                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">Schulstufe:</span> {coach.school_year}
                        </p>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        {user ? (
                          <button
                            onClick={() => openBookingModal(coach)}
                            disabled={
                              bookingState?.coachId === coach.id &&
                              bookingState.status === 'loading'
                            }
                            className={getBookingButtonStyle(coach)}
                          >
                            {getBookingButtonContent(coach)}
                          </button>
                        ) : (
                          <a
                            href="/login"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <CalendarPlus className="h-4 w-4" />
                            Anmelden zum Buchen
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedCoach(coach)}
                          className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
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

      {selectedCoach && (
        <CoachDetail coach={selectedCoach} onClose={() => setSelectedCoach(null)} />
      )}

      {subjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Fach auswählen</h2>
              <button
                onClick={() => setSubjectModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Für welches Fach möchtest du <span className="font-medium text-gray-700">{subjectModal.tutor.full_name}</span> buchen?
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {subjectModal.tutor.subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSubjectModal({ ...subjectModal, selected: subject })}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    subjectModal.selected === subject
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 text-gray-700'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSubjectModal(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleBookCoach}
                disabled={!subjectModal.selected}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <CalendarPlus size={15} />
                Anfrage senden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachesList;
