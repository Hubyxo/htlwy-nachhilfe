import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, Circle as XCircle, ClipboardList, CircleAlert as AlertCircle } from 'lucide-react';

interface PendingBooking {
  id: string;
  subject: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  coach: {
    id: string;
    user_id: string;
    department: string;
    class: string;
    subjects: string[];
  } | null;
  coachUser: {
    id: string;
    email: string;
    display_name: string;
    profile_image_url?: string;
  } | null;
}

const departmentColors: Record<string, { bg: string; text: string }> = {
  'Informationstechnologie': { bg: '#ec7404', text: '#fff' },
  'Maschinenbau': { bg: '#e63233', text: '#fff' },
  'Wirtschaftsingenieure': { bg: '#13509f', text: '#fff' },
  'Elektrotechnik': { bg: '#fec601', text: '#000' },
  'Mechatronik': { bg: '#97c81e', text: '#fff' },
};

const Buchungen: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('id, subject, status, rejection_reason, created_at, coach_id')
          .eq('student_id', user.id)
          .in('status', ['pending', 'cancelled'])
          .order('created_at', { ascending: false });
        if (error || !data) return;
        const result = await Promise.all(
          data.map(async (booking) => {
            const { data: coach } = await supabase
              .from('coach_profiles').select('id, user_id, department, class, subjects')
              .eq('id', booking.coach_id).maybeSingle();
            const coachUser = coach
              ? await supabase.from('users').select('id, email, display_name, profile_image_url')
                  .eq('id', coach.user_id).maybeSingle().then(({ data }) => data)
              : null;
            return { id: booking.id, subject: booking.subject, status: booking.status, rejection_reason: booking.rejection_reason, created_at: booking.created_at, coach: coach || null, coachUser: coachUser || null };
          })
        );
        setBookings(result);
      } catch (err) {
        console.error('Fehler beim Laden der Buchungen:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-500">Bitte melde dich an.</p>
      </div>
    );
  }

  const pending = bookings.filter((b) => b.status === 'pending');
  const rejected = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <ClipboardList size={20} className="text-blue-300" />
            </div>
            {pending.length > 0 && (
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                {pending.length} ausstehend
              </span>
            )}
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Meine Buchungen</h1>
          <p className="text-blue-100/60">Anfragen, die noch nicht beantwortet oder abgelehnt wurden</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
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
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-1">Keine Buchungen</p>
            <p className="text-gray-400 text-sm">Du hast noch keine Anfragen gestellt oder alle wurden bereits bestätigt.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-amber-500" />
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ausstehend</h2>
                </div>
                <div className="space-y-3">
                  {pending.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
                </div>
              </section>
            )}
            {rejected.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={14} className="text-red-400" />
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Abgelehnt</h2>
                </div>
                <div className="space-y-3">
                  {rejected.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard: React.FC<{ booking: PendingBooking }> = ({ booking }) => {
  const isPending = booking.status === 'pending';
  const deptColor = booking.coach?.department
    ? departmentColors[booking.coach.department] || { bg: '#6b7280', text: '#fff' }
    : { bg: '#6b7280', text: '#fff' };
  const displayName = booking.coachUser?.display_name || 'Unbekannter Coach';

  return (
    <div className={`bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${isPending ? 'border-gray-100' : 'border-red-100'}`}>
      <div className="flex items-start gap-4">
        {booking.coachUser?.profile_image_url ? (
          <img src={booking.coachUser.profile_image_url} alt={displayName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            {booking.coach?.department && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: deptColor.bg + '20', color: deptColor.bg }}>
                {booking.coach.department.split(' ')[0]}
              </span>
            )}
            {booking.subject && (
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                {booking.subject}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">Angefragt am {new Date(booking.created_at).toLocaleDateString('de-DE')}</p>
        </div>
        <div className="flex-shrink-0">
          {isPending ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              <Clock size={12} />Ausstehend
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
              <XCircle size={12} />Abgelehnt
            </span>
          )}
        </div>
      </div>
      {!isPending && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {booking.rejection_reason ? (
            <div className="flex items-start gap-2.5">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-600 mb-1">Begründung des Coaches</p>
                <p className="text-sm text-gray-600">"{booking.rejection_reason}"</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-gray-300" />
              <p className="text-sm text-gray-400">Keine Begründung angegeben.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Buchungen;
