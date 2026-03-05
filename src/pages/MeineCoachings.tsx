import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, Mail, User } from 'lucide-react';

interface ConfirmedBooking {
  id: string;
  subject: string | null;
  created_at: string;
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

  useEffect(() => {
    if (!user || !coachProfile) return;

    const fetchConfirmed = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('id, subject, created_at, student_id')
          .eq('coach_id', coachProfile.id)
          .eq('status', 'confirmed')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Meine Coachings</h1>
          {bookings.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {bookings.length}
            </span>
          )}
        </div>
        <p className="text-gray-500 mb-8">Schüler, die du als Coach bestätigt hast</p>

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
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {booking.student.profile_image_url ? (
                    <img
                      src={booking.student.profile_image_url}
                      alt={booking.student.display_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold border-2 border-blue-100 flex-shrink-0">
                      {booking.student.display_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-900">
                        {booking.student.display_name}
                      </h3>
                      {booking.subject && (
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {booking.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Gebucht am {new Date(booking.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>

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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeineCoachings;
