import React from 'react';
import TutorForm from '../components/TutorForm';
import StudentForm from '../components/StudentForm';

interface ApplicationFormProps {
  type: 'tutor' | 'student';
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ type }) => {
  const title = type === 'tutor' ? 'Als Nachhilfecoach bewerben' : 'Nachhilfe anfragen';

  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            {type === 'tutor' ? <TutorForm /> : <StudentForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;