import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, CheckCircle, Star, Clock, TrendingUp, Award, User } from 'lucide-react';

interface Stats {
  activeCoachings: number;
  completedCoachings: number;
  averageRating: number | null;
  totalRatings: number;
  pendingCoachings: number;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}> = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StarRating: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={16}
        className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
  </div>
);

const Profile: React.FC = () => {
  const { user, coachProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const isCoach = user?.role === 'coach';

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        if (isCoach && coachProfile) {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('status')
            .eq('coach_id', coachProfile.id);

          const active = bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
          const completed = bookings?.filter((b) => b.status === 'completed').length ?? 0;
          const pending = bookings?.filter((b) => b.status === 'pending').length ?? 0;

          const { data: ratingRows } = await supabase
            .from('ratings')
            .select('score')
            .eq('coach_id', coachProfile.id);

          const totalRatings = ratingRows?.length ?? 0;
          const avgRating =
            totalRatings > 0
              ? ratingRows!.reduce((sum, r) => sum + r.score, 0) / totalRatings
              : null;

          setStats({ activeCoachings: active, completedCoachings: completed, averageRating: avgRating, totalRatings, pendingCoachings: pending });
        } else {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('status')
            .eq('student_id', user.id);

          const active = bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
          const completed = bookings?.filter((b) => b.status === 'completed').length ?? 0;
          const pending = bookings?.filter((b) => b.status === 'pending').length ?? 0;

          setStats({ activeCoachings: active, completedCoachings: completed, averageRating: null, totalRatings: 0, pendingCoachings: pending });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, coachProfile, isCoach]);

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-6">
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={user.display_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-100">
                {user.display_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.display_name}</h1>
              <p className="text-gray-500 mt-0.5">{user.email}</p>
              <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                isCoach ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                <User size={12} />
                {isCoach ? 'Nachhilfecoach' : 'Schüler'}
              </span>
            </div>
          </div>

          {isCoach && coachProfile && (
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Abteilung</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{coachProfile.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Klasse</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{coachProfile.class}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Fächer</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {coachProfile.subjects.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{s}</span>
                  ))}
                  {coachProfile.subjects.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">+{coachProfile.subjects.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Statistiken
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={<BookOpen size={22} className="text-blue-600" />}
              label="Aktive Coachings"
              value={stats.activeCoachings}
              sub="Aktuell laufend"
              color="bg-blue-50"
            />
            <StatCard
              icon={<Clock size={22} className="text-orange-500" />}
              label="Ausstehend"
              value={stats.pendingCoachings}
              sub="Warten auf Bestätigung"
              color="bg-orange-50"
            />
            <StatCard
              icon={<CheckCircle size={22} className="text-green-600" />}
              label="Abgeschlossene Coachings"
              value={stats.completedCoachings}
              sub="Erfolgreich abgeschlossen"
              color="bg-green-50"
            />
            {isCoach && (
              <StatCard
                icon={<Award size={22} className="text-yellow-500" />}
                label="Bewertungen"
                value={stats.totalRatings}
                sub={
                  stats.averageRating !== null
                    ? `Ø ${stats.averageRating.toFixed(1)} von 5`
                    : 'Noch keine Bewertungen'
                }
                color="bg-yellow-50"
              />
            )}
          </div>
        ) : null}

        {isCoach && stats?.averageRating !== null && stats?.averageRating !== undefined && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Durchschnittliche Bewertung</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</span>
              <div>
                <StarRating value={stats.averageRating} />
                <p className="text-sm text-gray-500 mt-1">Basierend auf {stats.totalRatings} {stats.totalRatings === 1 ? 'Bewertung' : 'Bewertungen'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
