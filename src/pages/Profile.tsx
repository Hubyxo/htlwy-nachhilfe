import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, CircleCheck as CheckCircle, Star, Clock, TrendingUp, Award, User, Trash2, TriangleAlert as AlertTriangle, X } from 'lucide-react';

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
  const [deleteProfileModal, setDeleteProfileModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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

  const handleDeleteProfile = async () => {
    if (!coachProfile || !user) return;
    setDeleteLoading(true);
    try {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('coach_id', coachProfile.id).eq('status', 'pending');
      const { error } = await supabase.from('coach_profiles').delete().eq('id', coachProfile.id).eq('user_id', user.id);
      if (error) throw error;
      await supabase.from('users').update({ role: 'student' }).eq('id', user.id);
      setDeleteSuccess(true);
      setDeleteProfileModal(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error('Fehler beim Löschen des Profils:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 pb-8 flex items-center justify-center">
        <p className="text-gray-600">Bitte melde dich an.</p>
      </div>
    );
  }

  return (
    <>
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

        {isCoach && coachProfile && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Mein Coach-Profil
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Abteilung</p>
                  <p className="text-sm font-semibold text-gray-800">{coachProfile.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Klasse</p>
                  <p className="text-sm font-semibold text-gray-800">{coachProfile.class}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Verfügbarkeit</p>
                  <p className="text-sm text-gray-700">{coachProfile.availability}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Fächer</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {coachProfile.subjects.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                {coachProfile.additional_info && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Zusätzliche Infos</p>
                    <p className="text-sm text-gray-700">{coachProfile.additional_info}</p>
                  </div>
                )}
              </div>

              <div className="pt-5 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">
                  Du möchtest kein Coach mehr sein? Du kannst dein Profil löschen. Laufende Coachings bleiben bestehen, offene Anfragen werden storniert.
                </p>
                <button
                  onClick={() => setDeleteProfileModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={15} />
                  Coach-Profil löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
            Coach-Profil wurde gelöscht. Du wirst als Schüler weitergeführt.
          </div>
        )}
      </div>
    </div>

    {deleteProfileModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">Coach-Profil löschen</h2>
              <p className="text-sm text-gray-500">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            </div>
            <button
              onClick={() => setDeleteProfileModal(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <div className="bg-red-50 rounded-xl p-4 mb-5 text-sm text-red-700 space-y-1">
            <p className="font-medium">Was passiert beim Löschen:</p>
            <ul className="list-disc list-inside space-y-0.5 text-red-600">
              <li>Dein Coach-Profil wird dauerhaft entfernt</li>
              <li>Offene Buchungsanfragen werden storniert</li>
              <li>Dein Konto wird auf "Schüler" zurückgesetzt</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDeleteProfileModal(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleDeleteProfile}
              disabled={deleteLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deleteLoading ? 'Wird gelöscht...' : 'Profil löschen'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Profile;
