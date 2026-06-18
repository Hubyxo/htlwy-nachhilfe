import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, LogOut, CircleAlert as AlertCircle, TriangleAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminCoachForm from '../components/AdminCoachForm';

interface Tutor {
  id: string;
  full_name: string;
  email: string;
  subjects: string[];
  school_year: string;
  availability: string | null;
  additional_info: string | null;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Tutor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin/login');
      } else {
        fetchCoaches();
      }
    });
  }, [navigate]);

  const fetchCoaches = async () => {
    try {
      setIsLoading(true);
      setLoadError(false);
      const { data, error } = await supabase.from('tutors').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCoaches(data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Coaches:', err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const coach = coaches.find(c => c.id === id);

      // Demote first so role is cleaned up even if the tutors row delete fails
      if (coach?.email) {
        await supabase.rpc('admin_demote_coach', { coach_email: coach.email });
      }

      const { error } = await supabase.from('tutors').delete().eq('id', id);
      if (error) throw error;

      setCoaches(coaches.filter(c => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleOpenForm = (coach?: Tutor) => {
    setSelectedCoach(coach || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCoach(null);
  };

  const handleSave = () => {
    fetchCoaches();
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin-Panel</h1>
              <p className="text-gray-600 mt-2">Verwalten Sie alle Nachhilfecoaches</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              Abmelden
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Neuer Coach
            </button>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Coaches werden geladen...</p>
            </div>
          ) : loadError ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <TriangleAlert className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold mb-1">Laden fehlgeschlagen</p>
              <p className="text-gray-500 text-sm mb-4">Die Coaches konnten nicht geladen werden.</p>
              <button
                onClick={fetchCoaches}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Erneut versuchen
              </button>
            </div>
          ) : coaches.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Keine Coaches registriert.</p>
              <button
                onClick={() => handleOpenForm()}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Ersten Coach erstellen
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">E-Mail</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fächer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Schulstufe</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {coaches.map((coach) => (
                      <tr key={coach.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{coach.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{coach.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {coach.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{coach.school_year}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenForm(coach)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Bearbeiten"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(coach.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Löschen"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <AdminCoachForm
          coach={selectedCoach}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach löschen?</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie diesen Coach löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                Abbrechen
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
