import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tutor {
  id: string;
  full_name: string;
  email: string;
  subjects: string[];
  school_year: string;
  availability: string | null;
  additional_info: string | null;
}

interface AdminCoachFormProps {
  coach?: Tutor | null;
  onClose: () => void;
  onSave: () => void;
}

const AdminCoachForm: React.FC<AdminCoachFormProps> = ({ coach, onClose, onSave }) => {
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
    'Elektrotechnische Fächer',
  ];

  const schoolYears = [
    '1. Jahrgang',
    '2. Jahrgang',
    '3. Jahrgang',
    '4. Jahrgang',
    '5. Jahrgang',
  ];

  useEffect(() => {
    if (coach) {
      setFormData({
        fullName: coach.full_name,
        email: coach.email,
        subjects: coach.subjects || [],
        schoolYear: coach.school_year,
        availability: coach.availability || '',
        additionalInfo: coach.additional_info || '',
      });
    }
  }, [coach]);

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

      if (!formData.email.endsWith('@htlwy.at')) {
        throw new Error('Bitte verwende eine @htlwy.at E-Mail-Adresse.');
      }

      if (coach) {
        const { error } = await supabase.from('tutors').update({
          full_name: formData.fullName,
          email: formData.email,
          subjects: formData.subjects,
          school_year: formData.schoolYear,
          availability: formData.availability,
          additional_info: formData.additionalInfo,
        }).eq('id', coach.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('tutors').insert([
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
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {coach ? 'Coach bearbeiten' : 'Neuer Coach'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">Erfolgreich gespeichert!</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Fehler</h3>
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
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Fächer * (wähle mindestens eines)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <label key={subject} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="w-4 h-4 text-blue-600 rounded"
                    disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zusätzliche Informationen
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCoachForm;
