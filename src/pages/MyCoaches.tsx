import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { GraduationCap, Mail, CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';

interface CoachProfile {
  id: string;
  user_id: string;
  department: string;
  class: string;
  subjects: string[];
  availability: string;
  additional_info?: string;
  rating?: number;
}

interface CoachUser {
  id: string;
  email: string;
  display_name: string;
  profile_image_url?: string;
}

interface BookedCoach {
  bookingId: string;
  status: string;
  created_at: string;
  coach: CoachProfile;
  coachUser: CoachUser;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Ausstehend',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: <Clock size={14} className="text-yellow-600" />,
  },
  confirmed: {
    label: 'Bestätigt',
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: <CheckCircle size={14} className="text-green-600" />,
  },
  completed: {
    label: 'Abgeschlossen',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <CheckCircle size={14} className="text-blue-600" />,
  },
  cancelled: {
    label: 'Storniert',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    icon: <AlertCircle size={14} className="text-gray-400" />,
  },
};

const departmentColors: Record<string, { bg: string; text: string }> = {
  'Informationstechnologie': { bg: '#ec7404', text: '#fff' },
  'Maschinenbau': { bg: '#e63233', text: '#fff' },
  'Wirtschaftsingenieure': { bg: '#13509f', text: '#fff' },
  'Elektrotechnik': { bg: '#fec601', text: '#000' },
  'Mechatronik': { bg: '#97c81e', text: '#fff' },
};

const MyCoaches: React.FC = () => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<BookedCoach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyCoaches = async () => {
      try {
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('id, coach_id, status, created_at')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (error || !bookings) return;

        const result = await Promise.all(
          bookings.map(async (booking) => {
            const { data: coach } = await supabase
              .from('coach_profiles')
              .select('*')
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
              bookingId: booking.id,
              status: booking.status,
              created_at: booking.created_at,
              coach: coach || ({} as CoachProfile),
              coachUser: coachUser || { id: '', email: '', display_name: 'Unbekannt' },
            };
          })
        );

        setCoaches(result);
      } catch (err) {
        console.error('Error fetching coaches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCoaches();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-8 flex items-center justify-center">
        <p className="text-gray-600">Bitte melde dich an.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Meine Coaches</h1>
        </div>
        <p className="text-gray-500 mb-8">Coaches, die du gebucht hast</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : coaches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg font-medium">Noch keine Coaches gebucht</p>
            <p className="text-gray-400 text-sm mt-1">
              Besuche die{' '}
              <a href="/nachhilfecoaches" className="text-blue-600 hover:underline">
                Coaches-Seite
              </a>{' '}
              und buche deinen ersten Coach.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {coaches.map((entry) => {
              const cfg = statusConfig[entry.status] || statusConfig.cancelled;
              const deptColor = departmentColors[entry.coach.department] || { bg: '#6b7280', text: '#fff' };

              return (
                <div
                  key={entry.bookingId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {entry.coachUser.profile_image_url ? (
                        <img
                          src={entry.coachUser.profile_image_url}
                          alt={entry.coachUser.display_name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold border-2 border-blue-100 flex-shrink-0">
                          {entry.coachUser.display_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {entry.coachUser.display_name}
                          </h3>
                          {entry.coach.department && (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: deptColor.bg, color: deptColor.text }}
                            >
                              {entry.coach.department}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{entry.coachUser.email}</p>

                        {entry.coach.subjects?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {entry.coach.subjects.map((s) => (
                              <span key={s} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          {entry.coach.class && (
                            <span className="text-xs text-gray-500">
                              <span className="font-medium">Klasse:</span> {entry.coach.class}
                            </span>
                          )}
                          {entry.coach.rating != null && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Star size={12} className="text-yellow-400 fill-yellow-400" />
                              {entry.coach.rating.toFixed(1)}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Gebucht am {new Date(entry.created_at).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                      <a
                        href={`mailto:${entry.coachUser.email}`}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Mail size={13} />
                        Kontakt
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoaches;
