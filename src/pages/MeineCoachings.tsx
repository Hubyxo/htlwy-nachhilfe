import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, Mail, X, SquareCheck as CheckSquare } from 'lucide-react';

interface ConfirmedBooking {
  id: string;
  subject: string | null;
  created_at: string;
  status: string;
  completed_reason: string | null;
  student: {
    id: string;
    email: string;
    display_name: string;
    profile_image_url?: string;
  };
}

const MeineCoachings: React.FC = () => {
  const { user, coachProfile } = useAuth();
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [completeModal, setCompleteModal] = useState<{ bookingId: string; studentName: string } | null>(null);
  const [completeReason, setCompleteReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !coachProfile) return;

    const fetchConfirmed = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('id, subject, created_at, student_id, status, completed_reason')
          .eq('coach_id', coachProfile.id)
          .in('status', ['confirmed', 'completed'])
          .order('created_at', { ascending: false });

        if (!error && data) {
          const withStudents = await Promise.all(
            data.map(async (booking) => {
              const { data: student } = await supabase
                .from('users')
                .select('id, email, display_name, profile_image_url')
                .eq('id', booking.student_id)
                .maybeSingle();
              return {
                ...booking,
                student: student || { id: '', email: '', display_name: 'Unbekannt' },
              };
            })
          );
          setBookings(withStudents);
        }
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmed();
  }, [user, coachProfile]);

  const openCompleteModal = (bookingId: string, studentName: string) => {
    setCompleteReason('');
    setCompleteModal({ bookingId, studentName });
  };

  const handleComplete = async () => {
    if (!completeModal) return;
    const { bookingId } = completeModal;
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setActionLoading(bookingId);
    setCompleteModal(null);

    const trimmedReason = completeReason.trim();

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed', completed_reason: trimmedReason || null })
        .eq('id', bookingId);

      if (error) throw error;

      const reasonText = trimmedReason ? ` Abschlusskommentar: "${trimmedReason}"` : '';

      await supabase.from('notifications').insert({
        user_id: booking.student.id,
        type: 'booking_completed',
        message: `${user!.display_name} hat das Coaching mit dir abgeschlossen.${reasonText}`,
        read: false,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'completed', completed_reason: trimmedReason || null } : b
        )
      );
    } catch (err) {
      console.error('Fehler beim Abschließen:', err);
    } finally {
      setActionLoading(null);
      setCompleteReason('');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-8 flex items-center justify-center">
        <p className="text-gray-600">Bitte melde dich an.</p>
      </div>
    );
  }

  if (user.role !== 'coach') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-8 flex items-center justify-center">
        <p className="text-gray-600">Diese Seite ist nur für Coaches verfügbar.</p>
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={28} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Meine Coachings</h1>
            {activeBookings.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {activeBookings.length} aktiv
              </span>
            )}
          </div>
          <p className="text-gray-500 mb-8">Schüler, die du als Coach betreust oder betreut hast</p>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg font-medium">Noch keine bestätigten Coachings</p>
              <p className="text-gray-400 text-sm mt-1">
                Sobald du eine Buchungsanfrage annimmst, erscheint der Schüler hier.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {activeBookings.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Aktive Coachings
                  </h2>
                  <div className="space-y-4">
                    {activeBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        actionLoading={actionLoading}
                        onComplete={() => openCompleteModal(booking.id, booking.student.display_name)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completedBookings.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                    Abgeschlossene Coachings
                  </h2>
                  <div className="space-y-4">
                    {completedBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        actionLoading={actionLoading}
                        onComplete={() => {}}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {completeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckSquare size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Coaching abschließen</h2>
                <p className="text-sm text-gray-500">mit {completeModal.studentName}</p>
              </div>
              <button
                onClick={() => setCompleteModal(null)}
                className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abschlusskommentar <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={completeReason}
                onChange={(e) => setCompleteReason(e.target.value)}
                placeholder="z.B. Die Ziele wurden erreicht, viel Erfolg weiterhin!"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Der Kommentar wird dem Schüler im Benachrichtigungscenter angezeigt.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCompleteModal(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Abschließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface BookingCardProps {
  booking: ConfirmedBooking;
  actionLoading: string | null;
  onComplete: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, actionLoading, onComplete }) => {
  const isCompleted = booking.status === 'completed';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${isCompleted ? 'border-gray-100 opacity-80' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {booking.student.profile_image_url ? (
            <img
              src={booking.student.profile_image_url}
              alt={booking.student.display_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold border-2 flex-shrink-0 ${isCompleted ? 'bg-gray-400 border-gray-200' : 'bg-blue-600 border-blue-100'}`}>
              {booking.student.display_name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900">
                {booking.student.display_name}
              </h3>
              {booking.subject && (
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                  {booking.subject}
                </span>
              )}
              {isCompleted && (
                <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  Abgeschlossen
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {isCompleted ? 'Beendet' : 'Gebucht'} am {new Date(booking.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>

        {!isCompleted && (
          <button
            onClick={onComplete}
            disabled={actionLoading === booking.id}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            <CheckSquare size={13} />
            Beenden
          </button>
        )}
      </div>

      {isCompleted && booking.completed_reason && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">"{booking.completed_reason}"</p>
        </div>
      )}

      {!isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
          <Mail size={15} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            <a
              href={`mailto:${booking.student.email}`}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              {booking.student.email}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MeineCoachings;
