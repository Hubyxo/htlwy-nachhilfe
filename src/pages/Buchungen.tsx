import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, XCircle, ClipboardList, AlertCircle } from 'lucide-react';

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
              .from('coach_profiles')
              .select('id, user_id, department, class, subjects')
              .eq('id', booking.coach_id)
              .maybeSingle();

            const coachUser = coach
              ? await supabase
                  .from('users')
                  .select('id, email, display_name, profile_image_url')
                  .eq('id', coach.user_id)
                  .maybeSingle()
                  .then(({ data }) => data)
              : null;

            return {
              id: booking.id,
              subject: booking.subject,
              status: booking.status,
              rejection_reason: booking.rejection_reason,
              created_at: booking.created_at,
              coach: coach || null,
              coachUser: coachUser || null,
            };
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-8 flex items-center justify-center">
        <p className="text-gray-600">Bitte melde dich an.</p>
      </div>
    );
  }

  const pending = bookings.filter((b) => b.status === 'pending');
  const rejected = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Meine Buchungen</h1>
          {pending.length > 0 && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {pending.length} ausstehend
            </span>
          )}
        </div>
        <p className="text-gray-500 mb-8">Anfragen, die noch nicht beantwortet oder abgelehnt wurden</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
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
            <ClipboardList className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg font-medium">Keine Buchungen</p>
            <p className="text-gray-400 text-sm mt-1">
              Du hast noch keine Anfragen gestellt oder alle wurden bereits bestätigt.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Clock size={14} className="text-yellow-500" />
                  Ausstehend
                </h2>
                <div className="space-y-3">
                  {pending.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </section>
            )}

            {rejected.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <XCircle size={14} className="text-red-400" />
                  Abgelehnt
                </h2>
                <div className="space-y-3">
                  {rejected.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
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
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 transition-shadow hover:shadow-md ${
      isPending ? 'border-gray-100' : 'border-red-100'
    }`}>
      <div className="flex items-start gap-4">
        {booking.coachUser?.profile_image_url ? (
          <img
            src={booking.coachUser.profile_image_url}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold border-2 border-blue-100 flex-shrink-0">
            {initial}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900">{displayName}</h3>
            {booking.coach?.department && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: deptColor.bg, color: deptColor.text }}
              >
                {booking.coach.department}
              </span>
            )}
            {booking.subject && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {booking.subject}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Angefragt am {new Date(booking.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>

        <div className="flex-shrink-0">
          {isPending ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
              <Clock size={13} className="text-yellow-600" />
              Ausstehend
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
              <XCircle size={13} />
              Abgelehnt
            </span>
          )}
        </div>
      </div>

      {!isPending && (
        <div className={`mt-4 pt-4 border-t ${booking.rejection_reason ? 'border-red-100' : 'border-gray-100'}`}>
          {booking.rejection_reason ? (
            <div className="flex items-start gap-2">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-600 mb-0.5">Begründung des Coaches</p>
                <p className="text-sm text-gray-600">"{booking.rejection_reason}"</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-400">Keine Begründung angegeben.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Buchungen;
