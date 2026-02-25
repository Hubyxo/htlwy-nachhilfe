import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TutorApplication: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Werde Nachhilfecoach</h1>
          <p className="text-lg text-gray-600 mb-8">
            Du bist gut in bestimmten Fächern und möchtest dein Wissen weitergeben? Werde Teil unseres Nachhilfeprogramms und hilf deinen Mitschülern.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vorteile als Nachhilfecoach</h2>
            
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Festige dein eigenes Wissen durch das Erklären</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Sammle wertvolle Erfahrungen für deinen Lebenslauf</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Erhalte mindestens 10€ pro Stunde für deinen Unterricht</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Entwickle deine Kommunikations- und Präsentationsfähigkeiten</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Hilf anderen und sei ein aktiver Teil der Schulgemeinschaft</span>
              </li>
            </ul>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
              <h3 className="font-medium mb-1">Wusstest du schon?</h3>
              <p className="text-sm">
                Lehrende behalten durchschnittlich 90% des Materials, das sie anderen beibringen. Nachhilfe geben hilft also nicht nur deinen Mitschülern, sondern auch dir selbst!
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              to="/tutor-werden/formular"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Jetzt als Nachhilfecoach bewerben</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorApplication;