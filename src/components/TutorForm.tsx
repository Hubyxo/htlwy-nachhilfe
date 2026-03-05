import React, { useState, useEffect } from 'react';
import { Check, CircleAlert as AlertCircle } from 'lucide-react';
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
          department: (parsedClass?.department || '') as Department,
          classCode: parsedClass?.classCode || '',
          schoolYear: parsedClass?.schoolYear || '',
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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
      'Computerpraktikum'
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
      'Laboratorium, Werkstätte und Produktionstechnik'
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
      'Betriebspraxis'
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
      'Laboratorium, Werkstätte und Produktionstechnik'
    ],
    'Wirtschaftsingenieure': [
      'Unternehmensführung / Wirtschaftsrecht',
      'Betriebstechnik',
      'Information und Informationssysteme',
      'Konstruktion und Berechnung',
      'Werkstoff -und Fertigungstechnik',
      'Maschinen, Anlagen, Automatisierung',
      'Laboratorium',
      'Werkstätte und Produktionstechnik'
    ],
    '': []
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
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.department || formData.subjects.length === 0) {
        throw new Error('Bitte fülle alle erforderlichen Felder aus.');
      }

      const { error } = await supabase.from('tutors').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          department: formData.department,
          class: formData.classCode,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Bewerbung erfolgreich eingereicht!</h3>
            <p className="text-sm text-green-700 mt-1">
              Vielen Dank für deine Anmeldung als Nachhilfecoach. Wir werden uns bald bei dir melden.
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
          placeholder="vorname.nachname@htlwy.at"
        />
        <p className="text-xs text-gray-500 mt-1">Aus deinem Microsoft-Konto übernommen</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Klasse
          </label>
          <input
            type="text"
            value={formData.classCode}
            readOnly={!!parsedClass}
            onChange={(e) => !parsedClass && setFormData(prev => ({ ...prev, classCode: e.target.value }))}
            placeholder="z.B. 3AHET"
            className={`w-full px-4 py-2 border border-gray-300 rounded-md ${parsedClass ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
          />
          {parsedClass && <p className="text-xs text-gray-500 mt-1">Aus deiner HTL-E-Mail-Adresse ermittelt</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Abteilung *
          </label>
          {parsedClass ? (
            <>
              <input
                type="text"
                value={formData.department}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Aus deiner HTL-E-Mail-Adresse ermittelt</p>
            </>
          ) : (
            <select
              value={formData.department}
              onChange={(e) => {
                const newDept = e.target.value as Department;
                setFormData(prev => ({
                  ...prev,
                  department: newDept,
                  subjects: []
                }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bitte wählen</option>
              {departments.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {formData.department && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Welche Fächer unterrichtest du? * (wähle mindestens eines)
          </label>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Allgemeinbildung und Grundlagen</h4>
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded">
              {generalSubjects.map((subject) => (
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
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Abteilungsspezifische Fächer</h4>
            <div className="grid grid-cols-2 gap-3">
              {departmentSubjects[formData.department].map((subject) => (
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
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Schulstufe
        </label>
        {parsedClass ? (
          <>
            <input
              type="text"
              value={formData.schoolYear}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Aus deiner HTL-E-Mail-Adresse ermittelt</p>
          </>
        ) : (
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
        )}
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
          placeholder="Erzähle uns mehr über dich, deine Stärken oder spezielle Erfahrungen..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
