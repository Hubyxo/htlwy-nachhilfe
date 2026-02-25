import React from 'react';
import { BookOpen, Code, Database } from 'lucide-react';

const SubjectsList: React.FC = () => {
  const subjects = [
    {
      name: 'Hauptfächer',
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      description: 'Mathematik, Deutsch, Englisch und weitere zentrale Fächer',
    },
    {
      name: 'Allgemeine Fächer',
      icon: <Database className="h-6 w-6 text-blue-600" />,
      description: 'Unterstützung in allen allgemeinbildenden Fächern',
    },
    {
      name: 'Abteilungsspezifische Fächer',
      icon: <Code className="h-6 w-6 text-blue-600" />,
      description: 'Hilfe bei allen fachspezifischen Gegenständen deiner Abteilung',
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verfügbare Fächer
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Wir bieten Nachhilfe in allen Unterrichtsfächern an. Unsere Nachhilfecoaches unterstützen dich in den Bereichen, wo du Hilfe brauchst.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">{subject.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{subject.name}</h3>
              </div>
              <p className="text-gray-600">{subject.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-700 italic">
            Sprich uns an - wir finden für jedes Fach einen passenden Nachhilfecoach!
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubjectsList;