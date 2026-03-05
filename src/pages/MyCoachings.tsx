import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Check, X } from 'lucide-react';

interface Booking {
  id: string;
  student_id: string;
  status: string;
  created_at: string;
}

interface Student {
  id: string;
  email: string;
  display_name: string;
}

const MyCoachings: React.FC = () => {
  const { user, coachProfile } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { student: Student })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachingBookings = async () => {
      if (!user || !coachProfile) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('coach_id', coachProfile.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const bookingsWithStudents = await Promise.all(
            data.map(async (booking) => {
              const { data: student } = await supabase
                .from('users')
                .select('id, email, display_name')
                .eq('id', booking.student_id)
                .maybeSingle();

              return { ...booking, student: student || {} };
            })
          );
          setBookings(bookingsWithStudents);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingBookings();
  }, [user, coachProfile]);

  const handleConfirmBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            bookingId,
            action: 'confirm',
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to confirm booking');

      setBookings(
        bookings.map(b =>
          b.id === bookingId ? { ...b, status: 'confirmed' } : b
        )
      );
    } catch (err) {
      console.error('Error confirming booking:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            bookingId,
            action: 'reject',
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to reject booking');

      setBookings(
        bookings.map(b =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (err) {
      console.error('Error rejecting booking:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-16">Bitte melden Sie sich an.</div>;
  }

  if (user.role !== 'coach') {
    return (
      <div className="container mx-auto px-4 py-16">
        Diese Seite ist nur für Coaches verfügbar.
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-600" size={20} />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Ausstehend',
      confirmed: 'Bestätigt',
      completed: 'Abgeschlossen',
      cancelled: 'Storniert',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meine Schüler</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Noch keine Schüler gebucht</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.student?.display_name || 'Unbekannter Schüler'}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {booking.student?.email}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Gebucht: {new Date(booking.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 ml-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(booking.status)}
                      <span className="font-medium text-gray-700">
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-75"
                    >
                      <Check size={16} />
                      Bestätigen
                    </button>
                    <button
                      onClick={() => handleRejectBooking(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-75"
                    >
                      <X size={16} />
                      Ablehnen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoachings;
