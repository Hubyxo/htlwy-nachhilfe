import React from 'react';
import { BookOpen, Award, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Über unsere Plattform</h1>
          <p className="text-lg text-gray-600 mb-8">
            Die Nachhilfeplattform der HTL Waidhofen/Ybbs verbindet Schüler direkt mit Nachhilfecoaches – ohne Zwischenschritt, ohne Warteliste.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Unsere Mission</h2>
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700">
                  Unsere Plattform entstand aus der Überzeugung, dass Peer-to-Peer Lernen besonders wirksam ist. Wer den Stoff selbst erst kürzlich gemeistert hat, erklärt ihn oft verständlicher als jemand, der ihn schon lange kennt.
                </p>
                <p className="text-gray-700 mt-4">
                  Coaches und Schüler finden sich hier eigenständig – über ein einfaches Buchungssystem mit Microsoft-Login. Der Coach entscheidet selbst, welche Anfragen er annimmt, und macht den Termin direkt per Mail mit dem Schüler aus.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Unsere Werte</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Eigenverantwortung</h4>
                  <p className="text-sm text-gray-600">
                    Coaches verwalten ihr Profil selbst, Schüler buchen direkt – ohne Bürokratie.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Augenhöhe</h4>
                  <p className="text-sm text-gray-600">
                    Wir begegnen einander als Mitschüler – offen, respektvoll und ohne Leistungsdruck.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Gegenseitiger Nutzen</h4>
                  <p className="text-sm text-gray-600">
                    Der Coach festigt sein Wissen, der Schüler schließt Lücken – beide profitieren.
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
                Als Schüler auf der Plattform kannst du:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Coaches nach Fach oder Abteilung filtern</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Direkt eine Buchungsanfrage stellen</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Den Status deiner Anfragen jederzeit einsehen</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Termine flexibel direkt mit dem Coach absprechen</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Für Nachhilfecoaches</h3>
              <p className="text-gray-600 mb-4">
                Als Coach auf der Plattform kannst du:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dein Profil mit Fächern und Verfügbarkeit anlegen</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Buchungsanfragen annehmen oder ablehnen</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Deine aktiven Coachings im Überblick behalten</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mindestens 10€ pro Stunde verdienen</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Häufig gestellte Fragen</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wer kann die Plattform nutzen?</h3>
                <p className="text-gray-600">
                  Alle Schülerinnen und Schüler der HTL Waidhofen/Ybbs können sich mit ihrem Microsoft-Schulaccount anmelden – sowohl als Schüler als auch als Coach.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wie werde ich Coach?</h3>
                <p className="text-gray-600">
                  Nach der Anmeldung kannst du unter "Nachhilfecoach werden" ein Profil anlegen. Danach bist du direkt und ohne Warten in der Coach-Liste sichtbar.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wie läuft eine Buchung ab?</h3>
                <p className="text-gray-600">
                  Du suchst dir einen Coach, schickst eine Buchungsanfrage mit dem gewünschten Fach, und der Coach bestätigt oder lehnt ab. Bei Bestätigung macht der Coach per Mail einen Termin mit dir aus.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Was kostet die Nachhilfe?</h3>
                <p className="text-gray-600">
                  Die Kosten werden direkt zwischen Coach und Schüler vereinbart. Als Richtwert gilt ein Honorar von ca. 10€ pro Stunde für den Coach.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Wo finden die Stunden statt?</h3>
                <p className="text-gray-600">
                  Das klären Coach und Schüler selbst per Mail – ob in der Schule oder anderswo. Die Plattform übernimmt nur die Vermittlung.
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