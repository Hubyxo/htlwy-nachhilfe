import React from 'react';
import { BookOpen, Users, Award, Clock } from 'lucide-react';

const InfoSection: React.FC = () => {
  const benefits = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: 'Direkte Buchung',
      description:
        'Schüler suchen einen passenden Coach, sehen dessen Fächer und Verfügbarkeit – und schicken direkt eine Buchungsanfrage.',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Von Schülern für Schüler',
      description:
        'Alle Coaches sind HTL-Schüler, die den Stoff selbst kennen und auf Augenhöhe erklären können.',
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'Erfahrung & Anerkennung',
      description:
        'Als Coach sammelst du wichtige Soft Skills und wertvolle Erfahrung für deinen Lebenslauf.',
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Flexible Zeiten',
      description:
        'Termine werden direkt zwischen Coach und Schüler per Mail ausgemacht – komplett flexibel.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Warum unsere Plattform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Einfach, direkt, auf Augenhöhe – Nachhilfe innerhalb der HTL Waidhofen/Ybbs ohne Umwege.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-center">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-100 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                So funktioniert's
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Mit Microsoft anmelden</p>
                    <p className="text-gray-600">
                      Login mit deinem HTL-Account – kein extra Passwort nötig.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Coach finden oder werden</p>
                    <p className="text-gray-600">
                      Stöbere durch verfügbare Coaches oder erstelle dein eigenes Coach-Profil.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Buchung & Termin</p>
                    <p className="text-gray-600">
                      Schicke eine Buchungsanfrage – der Coach bestätigt, und ihr macht per Mail einen Termin aus.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg"
                alt="Schüler lernen gemeinsam"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;