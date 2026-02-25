import React from 'react';
import { BookOpen, Award, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Über unser Nachhilfeprogramm</h1>
          <p className="text-lg text-gray-600 mb-8">
            Erfahre mehr über die Initiative der HTL Waidhofen/Ybbs, Schülerinnen und Schüler durch ein Peer-to-Peer Nachhilfeprogramm zu unterstützen.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Unsere Mission</h2>
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700">
                  Unser Nachhilfeprogramm wurde ins Leben gerufen, um Schülerinnen und Schülern eine zusätzliche Lernunterstützung anzubieten. Wir glauben an die Kraft des Peer-to-Peer Lernens - wenn Schüler von Schülern lernen, entsteht eine besondere Dynamik.
                </p>
                <p className="text-gray-700 mt-4">
                  Unser Ziel ist es, eine unterstützende Lerngemeinschaft zu schaffen, in der sowohl die Nachhilfecoaches als auch die Lernenden profitieren. Die Nachhilfecoaches festigen ihr Wissen und entwickeln wichtige soziale Kompetenzen, während die Lernenden von einer individuellen Betreuung profitieren.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Unsere Werte</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Gemeinsames Lernen</h4>
                  <p className="text-sm text-gray-600">
                    Wir fördern eine Kultur des gegenseitigen Helfens und der Zusammenarbeit.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Respekt</h4>
                  <p className="text-sm text-gray-600">
                    Wir begegnen einander mit Respekt und schätzen unterschiedliche Lernstile.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Engagement</h4>
                  <p className="text-sm text-gray-600">
                    Wir setzen uns mit vollem Einsatz für den Lernerfolg aller Beteiligten ein.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Für Schüler</h3>
              <p className="text-gray-600 mb-4">
                Als teilnehmender Schüler erhältst du:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Individuelle Unterstützung in schwierigen Fächern</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Erklärungen auf Augenhöhe</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Flexibilität bei Terminvereinbarungen</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Besseres Verständnis des Unterrichtsstoffs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Für Nachhilfecoaches</h3>
              <p className="text-gray-600 mb-4">
                Als Nachhilfecoach profitierst du von:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Vertiefung deines eigenen Wissens</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Entwicklung von Kommunikationsfähigkeiten</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Wertvolle Erfahrung für deinen Lebenslauf</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kleines Honorar für deine Zeit und dein Engagement</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Häufig gestellte Fragen</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wer kann Nachhilfecoach werden?</h3>
                <p className="text-gray-600">
                  Jeder Schüler und jede Schülerin, der/die in bestimmten Fächern gute Leistungen erbringt und Interesse hat, anderen zu helfen, kann sich als Nachhilfecoach bewerben.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wie viel kostet die Nachhilfe?</h3>
                <p className="text-gray-600">
                  Unser Programm ist so konzipiert, dass es für alle zugänglich ist. Die Nachhilfecoaches erhalten eine kleine Aufwandsentschädigung, aber die Kosten werden bewusst niedrig gehalten.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wo finden die Nachhilfestunden statt?</h3>
                <p className="text-gray-600">
                  Die Nachhilfestunden können in den Räumlichkeiten der Schule während der festgelegten Zeiten stattfinden. Bei Bedarf können auch andere Arrangements getroffen werden.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wie lange dauert eine Nachhilfestunde?</h3>
                <p className="text-gray-600">
                  Eine typische Nachhilfestunde dauert 60 bis 90 Minuten, kann aber je nach Bedarf und Vereinbarung angepasst werden.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Gibt es eine Mindestanzahl an Stunden?</h3>
                <p className="text-gray-600">
                  Es gibt keine feste Mindestanzahl, aber regelmäßige Sitzungen sind empfehlenswert, um den bestmöglichen Lernerfolg zu erzielen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;