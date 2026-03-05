import React, { useState, useEffect } from 'react';
import { Check, CircleAlert as AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const StudentForm: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subjects: [] as string[],
    schoolYear: '',
    availability: '',
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setFormData(prev => ({
          ...prev,
          fullName: user.display_name || '',
          email: user.email || '',
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const subjects = [
    'Mathematik',
    'Deutsch',
    'Englisch',
    'Physik',
    'Chemie',
    'Geschichte',
    'Geographie',
    'Informationstechnische Fächer',
    'Maschinenbautechnische Fächer',
    'Wirtschaftliche Fächer',
    'Mechatronische Fächer',
    'Elektrotechnische Fächer'
  ];

  const schoolYears = [
    '1. Jahrgang',
    '2. Jahrgang',
    '3. Jahrgang',
    '4. Jahrgang',
    '5. Jahrgang',
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      if (!formData.fullName.trim() || !formData.email.trim() || formData.subjects.length === 0) {
        throw new Error('Bitte fülle alle erforderlichen Felder aus.');
      }

      const { error } = await supabase.from('students').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          subjects: formData.subjects,
          school_year: formData.schoolYear,
          availability: formData.availability,
          additional_info: formData.additionalInfo,
        },
      ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        subjects: [],
        schoolYear: '',
        availability: '',
        additionalInfo: '',
      });

      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Anfrage erfolgreich eingereicht!</h3>
            <p className="text-sm text-green-700 mt-1">
              Vielen Dank für deine Anmeldung. Wir werden dich bald mit einem passenden Nachhilfecoach verbinden.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Fehler beim Einreichen</h3>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vollständiger Name *
        </label>
        <input
          type="text"
          value={formData.fullName}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          placeholder="Dein Name"
        />
        <p className="text-xs text-gray-500 mt-1">Aus deinem Microsoft-Konto übernommen</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          E-Mail-Adresse *
        </label>
        <input
          type="email"
          value={formData.email}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          placeholder="deine.email@htlwy.at"
        />
        <p className="text-xs text-gray-500 mt-1">Aus deinem Microsoft-Konto übernommen</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          In welchen Fächern brauchst du Hilfe? * (wähle mindestens eines)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => (
            <label key={subject} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.subjects.includes(subject)}
                onChange={() => handleSubjectToggle(subject)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-gray-700">{subject}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Schulstufe
        </label>
        <select
          value={formData.schoolYear}
          onChange={(e) => setFormData(prev => ({ ...prev, schoolYear: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Bitte wählen</option>
          {schoolYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verfügbarkeit / Zeitfenster
        </label>
        <textarea
          value={formData.availability}
          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
          placeholder="z.B. Mo-Fr nach 16:00 Uhr, Sa ganztägig"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zusätzliche Informationen
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          placeholder="Erzähle uns mehr über deine Situation oder spezifische Probleme..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Wird eingereicht...' : 'Anfrage einreichen'}
      </button>
    </form>
  );
};

export default StudentForm;
