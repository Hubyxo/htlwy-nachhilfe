import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Banknote, BookOpenCheck, MessageSquare, Star, UserCheck } from 'lucide-react';

const TutorApplication: React.FC = () => {
  const benefits = [
    { icon: <BookOpenCheck size={18} />, color: 'bg-blue-100 text-blue-600', text: 'Festige dein eigenes Wissen durch das Erklären' },
    { icon: <Star size={18} />, color: 'bg-amber-100 text-amber-600', text: 'Sammle wertvolle Erfahrungen für deinen Lebenslauf' },
    { icon: <Banknote size={18} />, color: 'bg-emerald-100 text-emerald-600', text: 'Erhalte ca. 10€ oder mehr pro Stunde für deinen Unterricht' },
    { icon: <MessageSquare size={18} />, color: 'bg-violet-100 text-violet-600', text: 'Entwickle deine Kommunikations- und Präsentationsfähigkeiten' },
    { icon: <UserCheck size={18} />, color: 'bg-rose-100 text-rose-600', text: 'Du entscheidest selbst, welche Buchungsanfragen du annimmst' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Coach werden</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Werde Nachhilfecoach
            </h1>
            <p className="text-blue-100/60 text-lg">
              Gut in bestimmten Fächern? Gib dein Wissen weiter – und profitiere selbst davon.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Benefits */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Deine Vorteile als Coach</h2>
            <ul className="space-y-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${b.color} flex items-center justify-center`}>
                    {b.icon}
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed pt-1.5">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
            <h2 className="text-xl font-bold mb-4">Wie läuft's ab?</h2>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              Nach der Anmeldung kannst du unter "Coach werden" dein Profil anlegen: Fächer, Abteilung, Verfügbarkeit und weitere Infos.
              Schüler sehen dein Profil in der Coach-Liste und können dich direkt buchen. Du bestätigst oder lehnst Anfragen ab – und machst dann per Mail einen Termin aus.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <Link
              to="/tutor-werden/formular"
              className="group inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Coach-Profil erstellen
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <p className="text-sm text-gray-400 mt-3">Kostenlos & sofort sichtbar in der Coach-Liste</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorApplication;
