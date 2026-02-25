import React from 'react';
import { X, Mail } from 'lucide-react';

interface Tutor {
  id: string;
  full_name: string;
  email: string;
  subjects: string[];
  school_year: string;
  availability: string | null;
  additional_info: string | null;
}

interface CoachDetailProps {
  coach: Tutor;
  onClose: () => void;
}

const CoachDetail: React.FC<CoachDetailProps> = ({ coach, onClose }) => {
  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-gray-900">{coach.full_name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Schließen"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fächer</h3>
            <div className="flex flex-wrap gap-2">
              {coach.subjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {coach.school_year && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Schulstufe</h3>
              <p className="text-gray-900 font-medium">{coach.school_year}</p>
            </div>
          )}

          {coach.availability && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Verfügbarkeit</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{coach.availability}</p>
            </div>
          )}

          {coach.additional_info && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Zusätzliche Informationen</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{coach.additional_info}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Kontakt</h3>
            <a
              href={`mailto:${coach.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Mail className="h-5 w-5" />
              {coach.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDetail;
