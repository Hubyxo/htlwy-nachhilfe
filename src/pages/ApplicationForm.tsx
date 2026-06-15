import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TutorForm from '../components/TutorForm';
import StudentForm from '../components/StudentForm';

interface ApplicationFormProps {
  type: 'tutor' | 'student';
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ type }) => {
  const isTutor = type === 'tutor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to={isTutor ? '/tutor-werden' : '/nachhilfe-finden'}
            className="inline-flex items-center gap-2 text-blue-300/70 hover:text-blue-300 text-sm font-medium mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Zurück
          </Link>
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              {isTutor ? 'Coach werden' : 'Nachhilfe finden'}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              {isTutor ? 'Coach-Profil erstellen' : 'Nachhilfe anfragen'}
            </h1>
            <p className="text-blue-100/60 text-lg">
              {isTutor
                ? 'Fülle das Formular aus – dein Profil ist danach sofort in der Coach-Liste sichtbar.'
                : 'Beschreibe dein Anliegen und wir vermitteln dir den passenden Coach.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
            {isTutor ? <TutorForm /> : <StudentForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
