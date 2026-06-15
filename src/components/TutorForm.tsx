import React, { useState, useEffect } from 'react';
import { Check, CircleAlert as AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Department } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const TutorForm: React.FC = () => {
  const { user, parsedClass } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '' as Department,
    classCode: '',
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
    if (!user) {
      setIsLoading(false);
      return;
    }
    setFormData(prev => ({
      ...prev,
      fullName: user.display_name || '',
      email: user.email || '',
      department: (parsedClass?.department || '') as Department,
      classCode: parsedClass?.classCode || '',
      schoolYear: parsedClass?.schoolYear || '',
    }));
    setIsLoading(false);
  }, [user, parsedClass]);

  const departments: { name: Department; color: string }[] = [
    { name: 'Informationstechnologie', color: '#ec7404' },
    { name: 'Maschinenbau', color: '#e63233' },
    { name: 'Wirtschaftsingenieure', color: '#13509f' },
    { name: 'Elektrotechnik', color: '#fec601' },
    { name: 'Mechatronik', color: '#97c81e' },
  ];

  const departmentSubjects: Record<Department, string[]> = {
    'Informationstechnologie': [
      'Softwareentwicklung',
      'Informationstechnische Projekte',
      'Informationssysteme',
      'Systemtechnik',
      'Cloud Computing und industrielle Technologien',
      'Medientechnik',
      'Netzwerktechnik',
      'IT-Sicherheit',
      'Computerpraktikum',
    ],
    'Maschinenbau': [
      'Konstruktion und Projektmanagement',
      'Technische Mechanik und Berechnung',
      'Fertigungstechnik',
      'Maschinen und Anlagen',
      'Automatisierungstechnik',
      'Elektrotechnik und Elektronik',
      'Angewandte Informatik und Informationstechnik',
      'Robotik und Prozessdatenverarbeitung',
      'Laboratorium, Werkstätte und Produktionstechnik',
    ],
    'Mechatronik': [
      'Konstruktion und Projektmanagement',
      'Mechatronische Systeme',
      'Fertigungstechnik und Mechanik',
      'Elektrotechnik und Elektronik',
      'Informationstechnik und Automatisierung',
      'Produktionstechnik',
      'Laboratorium',
      'Werkstätte und Produktionstechnik',
      'Betriebspraxis',
    ],
    'Elektrotechnik': [
      'Energiesysteme',
      'Automatisierungstechnik',
      'Antriebstechnik',
      'Industrieelektronik',
      'Fachspezifische Informationstechnik',
      'Computergestützte Projektentwicklung',
      'Erneuerbare Energien und Elektromobilität',
      'Robotik und Systems Connectivity',
      'Laboratorium, Werkstätte und Produktionstechnik',
    ],
    'Wirtschaftsingenieure': [
      'Unternehmensführung / Wirtschaftsrecht',
      'Betriebstechnik',
      'Information und Informationssysteme',
      'Konstruktion und Berechnung',
      'Werkstoff -und Fertigungstechnik',
      'Maschinen, Anlagen, Automatisierung',
      'Laboratorium',
      'Werkstätte und Produktionstechnik',
    ],
    '': [],
  };

  const generalSubjects = [
    'Religion/Ethik',
    'Deutsch',
    'Englisch',
    'Geographie, Geschichte und politische Bildung',
    'Wirtschaft und Recht',
    'Bewegung und Sport',
    'Angewandte Mathematik',
    'Naturwissenschaften',
  ];

  const schoolYears = [
    '1. Jahrgang',
    '2. Jahrgang',
    '3. Jahrgang',
    '4. Jahrgang',
    '5. Jahrgang',
  ];

  const handleDepartmentChange = (dept: Department) => {
    setFormData(prev => ({ ...prev, department: dept, subjects: [] }));
  };

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
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.department || formData.subjects.length === 0 || !formData.availability.trim()) {
        throw new Error('Bitte fülle alle erforderlichen Felder aus.');
      }

      const { error } = await supabase.from('tutors').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          department: formData.department,
          subjects: formData.subjects,
          school_year: formData.schoolYear,
          availability: formData.availability,
          additional_info: formData.additionalInfo,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Diese E-Mail-Adresse ist bereits registriert.');
        }
        throw error;
      }

      if (user) {
        const { error: profileError } = await supabase.from('coach_profiles').upsert(
          {
            user_id: user.id,
            department: formData.department,
            class: formData.classCode,
            subjects: formData.subjects,
            availability: formData.availability,
            additional_info: formData.additionalInfo,
          },
          { onConflict: 'user_id' }
        );
        if (profileError) throw profileError;

        await supabase.from('users').update({ role: 'coach' }).eq('id', user.id);
      }

      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        department: '',
        classCode: '',
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success Toast */}
      {submitStatus === 'success' && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-white border border-green-200 shadow-xl rounded-2xl px-5 py-4 max-w-sm animate-fade-up">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Erfolgreich als Coach angemeldet!</p>
            <p className="text-xs text-gray-500 mt-0.5">Dein Profil ist jetzt in der Coach-Liste sichtbar.</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitStatus('idle')}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vollständiger Name *</label>
          <input
            type="text"
            value={formData.fullName}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Aus deinem Microsoft-Konto übernommen</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse *</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Aus deinem Microsoft-Konto übernommen</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Abteilung *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {departments.map((dept) => {
            const selected = formData.department === dept.name;
            return (
              <button
                key={dept.name}
                type="button"
                onClick={() => handleDepartmentChange(dept.name)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                  selected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dept.color }}
                />
                <span className={`text-sm font-medium ${selected ? 'text-blue-800' : 'text-gray-700'}`}>
                  {dept.name}
                </span>
                {selected && (
                  <Check className="h-4 w-4 text-blue-500 absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Jahrgang *</label>
        <div className="flex flex-wrap gap-3">
          {schoolYears.map((year) => {
            const selected = formData.schoolYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, schoolYear: year }))}
                className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  selected
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      {formData.department && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Welche Fächer unterrichtest du? * <span className="text-gray-400 font-normal">(mindestens eines)</span>
          </label>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Allgemeinbildung und Grundlagen
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {generalSubjects.map((subject) => {
                  const checked = formData.subjects.includes(subject);
                  return (
                    <label
                      key={subject}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                        checked
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSubjectToggle(subject)}
                        className="w-4 h-4 text-blue-600 rounded accent-blue-600"
                      />
                      <span className={`text-sm ${checked ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                        {subject}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Abteilungsspezifische Fächer
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {departmentSubjects[formData.department].map((subject) => {
                  const checked = formData.subjects.includes(subject);
                  return (
                    <label
                      key={subject}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                        checked
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSubjectToggle(subject)}
                        className="w-4 h-4 text-blue-600 rounded accent-blue-600"
                      />
                      <span className={`text-sm ${checked ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                        {subject}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Verfügbarkeit / Zeitfenster *</label>
        <textarea
          value={formData.availability}
          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
          placeholder="z.B. Mo-Fr nach 16:00 Uhr, Sa ganztägig"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Zusätzliche Informationen</label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          placeholder="Erzähle uns mehr über dich, deine Stärken oder spezielle Erfahrungen..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Wird eingereicht...' : 'Bewerbung einreichen'}
      </button>
    </form>
  );
};

export default TutorForm;