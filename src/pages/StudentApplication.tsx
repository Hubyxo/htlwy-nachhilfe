import React from 'react';
import { ArrowRight, Book, ThumbsUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentApplication: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nachhilfe finden</h1>
          <p className="text-lg text-gray-600 mb-8">
            Brauchst du Hilfe in bestimmten Fächern? Stöbere durch die verfügbaren Coaches und buche direkt – unkompliziert und auf Augenhöhe.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500">
              <div className="mb-4">
                <div className="bg-blue-100 rounded-full p-3 inline-block">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Passender Coach</h3>
              <p className="text-gray-600 text-sm">
                Filtere Coaches nach Fach oder Abteilung und finde jemanden, der genau das unterrichtet, was du brauchst.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-500">
              <div className="mb-4">
                <div className="bg-green-100 rounded-full p-3 inline-block">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Auf Augenhöhe</h3>
              <p className="text-gray-600 text-sm">
                Lerne von Mitschülern, die den Stoff selbst frisch gemeistert haben und wissen, wo die Schwierigkeiten liegen.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-orange-500">
              <div className="mb-4">
                <div className="bg-orange-100 rounded-full p-3 inline-block">
                  <ThumbsUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bessere Noten</h3>
              <p className="text-gray-600 text-sm">
                Regelmäßige Nachhilfestunden helfen dir, Lücken zu schließen und mehr Sicherheit im Fach zu gewinnen.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">So funktioniert's</h2>

            <ol className="relative border-l border-gray-200 ml-3 space-y-6 mb-6">
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">1</span>
                </span>
                <h3 className="font-semibold text-gray-800">Mit HTL-Account anmelden</h3>
                <p className="text-gray-600 text-sm">
                  Melde dich mit deinem Microsoft-Schulaccount an – kein eigenes Passwort notwendig.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">2</span>
                </span>
                <h3 className="font-semibold text-gray-800">Coach suchen</h3>
                <p className="text-gray-600 text-sm">
                  Schau dir die Coach-Liste an, lies Profile durch und wähle jemanden, der zu deinem Bedarf passt.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">3</span>
                </span>
                <h3 className="font-semibold text-gray-800">Buchungsanfrage schicken</h3>
                <p className="text-gray-600 text-sm">
                  Schicke eine Buchungsanfrage mit dem gewünschten Fach direkt über die Plattform.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">4</span>
                </span>
                <h3 className="font-semibold text-gray-800">Termin ausmachen & loslegen</h3>
                <p className="text-gray-600 text-sm">
                  Sobald der Coach bestätigt, meldet er sich per Mail bei dir – und ihr findet gemeinsam einen passenden Termin.
                </p>
              </li>
            </ol>
          </div>

          <div className="text-center">
            <Link
              to="/nachhilfecoaches"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Coaches entdecken</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentApplication;