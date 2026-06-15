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
  student: { id: string; email: string; display_name: string; profile_image_url?: string };
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
        const { data, error } = await supabase.from('bookings')
          .select('id, subject, created_at, student_id, status, completed_reason')
          .eq('coach_id', coachProfile.id).in('status', ['confirmed', 'completed'])
          .order('created_at', { ascending: false });
        if (!error && data) {
          const withStudents = await Promise.all(
            data.map(async (booking) => {
              const { data: student } = await supabase.from('users')
                .select('id, email, display_name, profile_image_url').eq('id', booking.student_id).maybeSingle();
              return { ...booking, student: student || { id: '', email: '', display_name: 'Unbekannt' } };
            })
          );
          setBookings(withStudents);
        }
      } catch (err) { console.error('Fehler beim Laden:', err); }
      finally { setLoading(false); }
    };
    fetchConfirmed();
  }, [user, coachProfile]);

  const openCompleteModal = (bookingId: string, studentName: string) => { setCompleteReason(''); setCompleteModal({ bookingId, studentName }); };

  const handleComplete = async () => {
    if (!completeModal) return;
    const { bookingId } = completeModal;
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    setActionLoading(bookingId);
    setCompleteModal(null);
    const trimmedReason = completeReason.trim();
    try {
      const { error } = await supabase.from('bookings').update({ status: 'completed', completed_reason: trimmedReason || null }).eq('id', bookingId);
      if (error) throw error;
      await supabase.from('notifications').insert({ user_id: booking.student.id, type: 'booking_completed', message: `${user!.display_name} hat das Coaching mit dir abgeschlossen.${trimmedReason ? ` Abschlusskommentar: "${trimmedReason}"` : ''}`, read: false });
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'completed', completed_reason: trimmedReason || null } : b));
    } catch (err) { console.error('Fehler beim Abschließen:', err); }
    finally { setActionLoading(null); setCompleteReason(''); }
  };

  if (!user) return <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center"><p className="text-gray-500">Bitte melde dich an.</p></div>;
  if (user.role !== 'coach') return <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center"><p className="text-gray-500">Diese Seite ist nur für Coaches verfügbar.</p></div>;

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid-dark" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <BookOpen size={20} className="text-blue-300" />
              </div>
              {activeBookings.length > 0 && (
                <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  {activeBookings.length} aktiv
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Meine Coachings</h1>
            <p className="text-blue-100/60">Schüler, die du als Coach betreust oder betreut hast</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200" />
                    <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-1/3 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">Noch keine bestätigten Coachings</p>
              <p className="text-gray-400 text-sm">Sobald du eine Buchungsanfrage annimmst, erscheint der Schüler hier.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {activeBookings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aktive Coachings</h2>
                  </div>
                  <div className="space-y-4">
                    {activeBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} actionLoading={actionLoading} onComplete={() => openCompleteModal(booking.id, booking.student.display_name)} />
                    ))}
                  </div>
                </div>
              )}
              {completedBookings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Abgeschlossene Coachings</h2>
                  </div>
                  <div className="space-y-4">
                    {completedBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} actionLoading={actionLoading} onComplete={() => {}} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {completeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckSquare size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">Coaching abschließen</h2>
                <p className="text-sm text-gray-500">mit {completeModal.studentName}</p>
              </div>
              <button onClick={() => { setCompleteModal(null); setCompleteReason(''); }} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Abschlusskommentar <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={completeReason}
                onChange={(e) => setCompleteReason(e.target.value)}
                placeholder="z.B. Die Ziele wurden erreicht, viel Erfolg weiterhin!"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setCompleteModal(null); setCompleteReason(''); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Abbrechen</button>
              <button onClick={handleComplete} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Abschließen</button>
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
    <div className={`bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden ${isCompleted ? 'opacity-80' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {booking.student.profile_image_url ? (
              <img src={booking.student.profile_image_url} alt={booking.student.display_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 bg-gradient-to-br ${isCompleted ? 'from-gray-400 to-gray-500' : 'from-blue-500 to-blue-700'}`}>
                {booking.student.display_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{booking.student.display_name}</h3>
                {booking.subject && (
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg ${isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    {booking.subject}
                  </span>
                )}
                {isCompleted && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">Abgeschlossen</span>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{isCompleted ? 'Beendet' : 'Gebucht'} am {new Date(booking.created_at).toLocaleDateString('de-DE')}</p>
            </div>
          </div>
          {!isCompleted && (
            <button
              onClick={onComplete}
              disabled={actionLoading === booking.id}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              <CheckSquare size={13} />Beenden
            </button>
          )}
        </div>
        {isCompleted && booking.completed_reason && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">"{booking.completed_reason}"</p>
          </div>
        )}
        {!isCompleted && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Mail size={14} className="text-blue-500 flex-shrink-0" />
            <a href={`mailto:${booking.student.email}`} className="text-sm text-blue-600 hover:underline font-medium">{booking.student.email}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeineCoachings;
