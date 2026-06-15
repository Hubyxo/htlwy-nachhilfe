import React from 'react';
import { BookOpen, Code, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubjectsList: React.FC = () => {
  const subjects = [
    {
      name: 'Hauptfächer',
      icon: <BookOpen className="h-7 w-7" />,
      color: 'from-blue-500 to-blue-600',
      border: 'hover:border-blue-200',
      description: 'Mathematik, Deutsch, Englisch und weitere zentrale Fächer',
      tags: ['Mathematik', 'Deutsch', 'Englisch', 'Physik'],
    },
    {
      name: 'Allgemeine Fächer',
      icon: <Database className="h-7 w-7" />,
      color: 'from-emerald-500 to-emerald-600',
      border: 'hover:border-emerald-200',
      description: 'Unterstützung in allen allgemeinbildenden Fächern',
      tags: ['Chemie', 'Geschichte', 'Geographie', 'Biologie'],
    },
    {
      name: 'Abteilungsfächer',
      icon: <Code className="h-7 w-7" />,
      color: 'from-violet-500 to-violet-600',
      border: 'hover:border-violet-200',
      description: 'Hilfe bei allen fachspezifischen Gegenständen deiner Abteilung',
      tags: ['IT', 'Maschinenbau', 'Elektrotechnik', 'Mechatronik'],
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Fächer</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Verfügbare Fächer</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Wir bieten Nachhilfe in allen Unterrichtsfächern an — unsere Coaches helfen dir da, wo du es brauchst.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className={`group p-7 bg-white rounded-2xl border border-gray-100 ${subject.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {subject.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">{subject.description}</p>
              <div className="flex flex-wrap gap-2">
                {subject.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-400 rounded-full">+mehr</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/nachhilfecoaches"
            className="group inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Alle Coaches durchsuchen
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubjectsList;
