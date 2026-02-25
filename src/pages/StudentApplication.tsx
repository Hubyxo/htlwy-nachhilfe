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
            Brauchst du Hilfe in bestimmten Fächern? Unser Nachhilfeprogramm bringt dich mit Mitschülern zusammen, die dir helfen können.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500">
              <div className="mb-4">
                <div className="bg-blue-100 rounded-full p-3 inline-block">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Individuelles Lernen</h3>
              <p className="text-gray-600 text-sm">
                Lerne in deinem eigenen Tempo und konzentriere dich auf die Themen, die dir Schwierigkeiten bereiten.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-500">
              <div className="mb-4">
                <div className="bg-green-100 rounded-full p-3 inline-block">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Peer-to-Peer Lernen</h3>
              <p className="text-gray-600 text-sm">
                Lerne von Mitschülern, die den Stoff bereits gemeistert haben und ihn dir auf Augenhöhe erklären können.
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
                Verbessere deine schulischen Leistungen und gewinne mehr Selbstvertrauen in herausfordernden Fächern.
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
                <h3 className="font-semibold text-gray-800">Anmeldung</h3>
                <p className="text-gray-600 text-sm">
                  Fülle das Anmeldeformular aus und teile uns mit, in welchen Fächern du Hilfe benötigst.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">2</span>
                </span>
                <h3 className="font-semibold text-gray-800">Vermittlung</h3>
                <p className="text-gray-600 text-sm">
                  Wir bringen dich mit einem passenden Nachhilfecoach zusammen, der dir in den gewünschten Fächern helfen kann.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">3</span>
                </span>
                <h3 className="font-semibold text-gray-800">Termine vereinbaren</h3>
                <p className="text-gray-600 text-sm">
                  Ihr vereinbart gemeinsam Termine für die Nachhilfestunden, die in euren Stundenplan passen.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-blue-600 font-bold">4</span>
                </span>
                <h3 className="font-semibold text-gray-800">Lernen & Verbessern</h3>
                <p className="text-gray-600 text-sm">
                  Regelmäßige Nachhilfestunden helfen dir, den Stoff besser zu verstehen und deine Noten zu verbessern.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="text-center">
            <Link
              to="/nachhilfe-finden/formular"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Jetzt Nachhilfe anfragen</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentApplication;