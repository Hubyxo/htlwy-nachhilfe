import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Check, X, Users, Mail } from 'lucide-react';

interface Booking {
  id: string;
  student_id: string;
  status: string;
  subject: string | null;
  created_at: string;
}

interface Student {
  id: string;
  email: string;
  display_name: string;
  profile_image_url?: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  pending: { label: 'Ausstehend', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: <Clock size={13} className="text-amber-600" /> },
  confirmed: { label: 'Bestätigt', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: <CheckCircle size={13} className="text-emerald-600" /> },
  completed: { label: 'Abgeschlossen', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: <CheckCircle size={13} className="text-blue-600" /> },
  cancelled: { label: 'Storniert', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', icon: <AlertCircle size={13} className="text-gray-400" /> },
};

const MyCoachings: React.FC = () => {
  const { user, coachProfile } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { student: Student })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [rejectModal, setRejectModal] = useState<{ bookingId: string; studentName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!user || !coachProfile) return;
    const fetchCoachingBookings = async () => {
      try {
        const { data, error } = await supabase.from('bookings').select('*')
          .eq('coach_id', coachProfile.id).order('created_at', { ascending: false });
        if (!error && data) {
          const bookingsWithStudents = await Promise.all(
            data.map(async (booking) => {
              const { data: student } = await supabase.from('users')
                .select('id, email, display_name, profile_image_url').eq('id', booking.student_id).maybeSingle();
              return { ...booking, student: student || { id: '', email: '', display_name: 'Unbekannt' } };
            })
          );
          setBookings(bookingsWithStudents);
        }
      } catch (err) { console.error('Error fetching bookings:', err); }
      finally { setLoading(false); }
    };
    fetchCoachingBookings();
  }, [user, coachProfile]);

  const handleConfirm = async (bookingId: string, studentId: string, studentName: string, studentEmail: string, subject: string | null) => {
    setActionLoading(bookingId);
    try {
      const { error } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);
      if (error) throw error;
      await supabase.from('notifications').insert({ user_id: studentId, type: 'booking_confirmed', message: `${user!.display_name} hat deine Buchungsanfrage angenommen! Schreib ihm/ihr eine E-Mail um alles weitere zu besprechen: ${user!.email}`, read: false });
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }, body: JSON.stringify({ to: studentEmail, type: 'booking_confirmed', data: { coachName: user!.display_name, coachEmail: user!.email, subject: subject || 'Nachhilfe' } }) }).catch((err) => console.error('Email error:', err));
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b)));
    } catch (err) { console.error('Error confirming booking:', err); }
    finally { setActionLoading(null); }
  };

  const openRejectModal = (bookingId: string, studentName: string) => { setRejectReason(''); setRejectModal({ bookingId, studentName }); };

  const handleReject = async () => {
    if (!rejectModal) return;
    const { bookingId } = rejectModal;
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    setActionLoading(bookingId);
    setRejectModal(null);
    const trimmedReason = rejectReason.trim();
    try {
      const { error } = await supabase.from('bookings').update({ status: 'cancelled', rejection_reason: trimmedReason || null }).eq('id', bookingId);
      if (error) throw error;
      await supabase.from('notifications').insert({ user_id: booking.student_id, type: 'booking_rejected', message: `${user!.display_name} hat deine Buchungsanfrage leider abgelehnt.${trimmedReason ? ` Begründung: "${trimmedReason}"` : ''}`, read: false });
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }, body: JSON.stringify({ to: booking.student.email, type: 'booking_rejected', data: { coachName: user!.display_name, subject: booking.subject || 'Nachhilfe', reason: trimmedReason || undefined } }) }).catch((err) => console.error('Email error:', err));
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)));
    } catch (err) { console.error('Error rejecting booking:', err); }
    finally { setActionLoading(null); setRejectReason(''); }
  };

  if (!user) return <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center"><p className="text-gray-500">Bitte melde dich an.</p></div>;
  if (user.role !== 'coach') return <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center"><p className="text-gray-500">Diese Seite ist nur für Coaches verfügbar.</p></div>;

  const filters = [
    { key: 'all', label: 'Alle' }, { key: 'pending', label: 'Ausstehend' },
    { key: 'confirmed', label: 'Bestätigt' }, { key: 'completed', label: 'Abgeschlossen' }, { key: 'cancelled', label: 'Storniert' },
  ];
  const displayed = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const counts = bookings.reduce<Record<string, number>>((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
  const pendingCount = counts['pending'] || 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid-dark" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Users size={20} className="text-blue-300" />
              </div>
              {pendingCount > 0 && (
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  {pendingCount} neu
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Buchungsanfragen</h1>
            <p className="text-blue-100/60">Verwalte eingehende Anfragen von Schülern</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filter === f.key ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-xs ${filter === f.key ? 'opacity-70' : 'text-gray-400'}`}>
                  {f.key === 'all' ? bookings.length : (counts[f.key] || 0)}
                </span>
              </button>
            ))}
          </div>

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
          ) : displayed.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">Keine Anfragen gefunden</p>
              <p className="text-gray-400 text-sm">{filter !== 'all' ? 'Versuche einen anderen Filter.' : 'Noch hat niemand dein Coaching angefragt.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayed.map((booking) => {
                const cfg = statusConfig[booking.status] || statusConfig.cancelled;
                return (
                  <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {booking.student.profile_image_url ? (
                            <img src={booking.student.profile_image_url} alt={booking.student.display_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                              {booking.student.display_name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900">{booking.student.display_name}</h3>
                            {booking.subject && (
                              <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                                {booking.subject}
                              </span>
                            )}
                            <p className="text-xs text-gray-400 mt-1">{booking.student.email}</p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.icon}{cfg.label}
                        </span>
                      </div>

                      {booking.status === 'confirmed' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                          <Mail size={14} className="text-blue-500 flex-shrink-0" />
                          <p className="text-sm text-gray-600">
                            Schreib <span className="font-medium">{booking.student.display_name}</span> eine E-Mail:{' '}
                            <a href={`mailto:${booking.student.email}`} className="text-blue-600 hover:underline font-medium">{booking.student.email}</a>
                          </p>
                        </div>
                      )}

                      {booking.status === 'pending' && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleConfirm(booking.id, booking.student_id, booking.student.display_name, booking.student.email, booking.subject)}
                            disabled={actionLoading === booking.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 text-sm font-semibold"
                          >
                            <Check size={15} />Annehmen
                          </button>
                          <button
                            onClick={() => openRejectModal(booking.id, booking.student.display_name)}
                            disabled={actionLoading === booking.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-60 text-sm font-semibold"
                          >
                            <X size={15} />Ablehnen
                          </button>
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

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <X size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Anfrage ablehnen</h2>
                <p className="text-sm text-gray-500">von {rejectModal.studentName}</p>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Begründung <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="z.B. Ich habe bereits zu viele Schüler..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Abbrechen</button>
              <button onClick={handleReject} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Ablehnen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCoachings;
