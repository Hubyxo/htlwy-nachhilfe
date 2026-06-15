import React from 'react';
import { ArrowRight, Book, ThumbsUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentApplication: React.FC = () => {
  const cards = [
    {
      icon: <Book className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      title: 'Passender Coach',
      desc: 'Filtere Coaches nach Fach oder Abteilung und finde jemanden, der genau das unterrichtet, was du brauchst.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600',
      title: 'Auf Augenhöhe',
      desc: 'Lerne von Mitschülern, die den Stoff selbst frisch gemeistert haben und wissen, wo die Schwierigkeiten liegen.',
    },
    {
      icon: <ThumbsUp className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-500',
      title: 'Bessere Noten',
      desc: 'Regelmäßige Nachhilfestunden helfen dir, Lücken zu schließen und mehr Sicherheit im Fach zu gewinnen.',
    },
  ];

  const steps = [
    { num: '01', title: 'Mit HTL-Account anmelden', desc: 'Melde dich mit deinem Microsoft-Schulaccount an – kein eigenes Passwort notwendig.' },
    { num: '02', title: 'Coach suchen', desc: 'Schau dir die Coach-Liste an und wähle jemanden, der zu deinem Bedarf passt.' },
    { num: '03', title: 'Buchungsanfrage schicken', desc: 'Schicke eine Buchungsanfrage mit dem gewünschten Fach direkt über die Plattform.' },
    { num: '04', title: 'Termin ausmachen & loslegen', desc: 'Sobald der Coach bestätigt, meldet er sich per Mail – und ihr findet einen gemeinsamen Termin.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-600/15 rounded-full blur-[90px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Nachhilfe finden</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Coach finden
            </h1>
            <p className="text-blue-100/60 text-lg">
              Stöbere durch verfügbare Coaches und buche direkt – unkompliziert und auf Augenhöhe.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Benefit cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} text-white mb-4 shadow-sm`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-7">So funktioniert's</h2>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {step.num}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <Link
              to="/nachhilfecoaches"
              className="group inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Coaches entdecken
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplication;
