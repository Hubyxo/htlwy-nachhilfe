import React, { useState } from 'react';
import { BookOpen, Award, Heart, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Wer kann die Plattform nutzen?',
    a: 'Alle Schülerinnen und Schüler der HTL Waidhofen/Ybbs können sich mit ihrem Microsoft-Schulaccount anmelden – sowohl als Schüler als auch als Coach.',
  },
  {
    q: 'Wie werde ich Coach?',
    a: 'Nach der Anmeldung kannst du unter "Coach werden" ein Profil anlegen. Danach bist du direkt in der Coach-Liste sichtbar.',
  },
  {
    q: 'Wie läuft eine Buchung ab?',
    a: 'Du suchst dir einen Coach, schickst eine Buchungsanfrage mit dem gewünschten Fach, und der Coach bestätigt oder lehnt ab. Bei Bestätigung macht der Coach per Mail einen Termin aus.',
  },
  {
    q: 'Was kostet die Nachhilfe?',
    a: 'Die Kosten werden direkt zwischen Coach und Schüler vereinbart. Als Richtwert gilt ca. 10€ pro Stunde.',
  },
  {
    q: 'Wo finden die Stunden statt?',
    a: 'Das klären Coach und Schüler selbst per Mail – ob in der Schule oder anderswo. Die Plattform übernimmt nur die Vermittlung.',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm">{q}</span>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48' : 'max-h-0'}`}>
        <p className="text-sm text-gray-600 px-6 pb-4 leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const values = [
    { title: 'Eigenverantwortung', desc: 'Coaches verwalten ihr Profil selbst, Schüler buchen direkt – ohne Bürokratie.' },
    { title: 'Augenhöhe', desc: 'Wir begegnen einander als Mitschüler – offen, respektvoll und ohne Leistungsdruck.' },
    { title: 'Gegenseitiger Nutzen', desc: 'Der Coach festigt sein Wissen, der Schüler schließt Lücken – beide profitieren.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Über uns</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Unsere Plattform
            </h1>
            <p className="text-blue-100/60 text-lg">
              Wir verbinden Schüler direkt mit Nachhilfecoaches — ohne Zwischenschritt, ohne Warteliste.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Mission */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Unsere Mission</h2>
                <p className="text-sm text-gray-500">Peer-to-Peer Lernen als wirksamster Ansatz</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unsere Plattform entstand aus der Überzeugung, dass Peer-to-Peer Lernen besonders wirksam ist. Wer den Stoff selbst erst kürzlich gemeistert hat, erklärt ihn oft verständlicher als jemand, der ihn schon lange kennt.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Coaches und Schüler finden sich hier eigenständig – über ein einfaches Buchungssystem mit Microsoft-Login. Der Coach entscheidet selbst, welche Anfragen er annimmt, und macht den Termin direkt per Mail mit dem Schüler aus.
            </p>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Unsere Werte</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-100 hover:shadow-md transition-all duration-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For students / coaches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Für Schüler',
                items: [
                  'Coaches nach Fach oder Abteilung filtern',
                  'Direkt eine Buchungsanfrage stellen',
                  'Status deiner Anfragen jederzeit einsehen',
                  'Termine flexibel direkt mit dem Coach absprechen',
                ],
              },
              {
                icon: <Award className="h-6 w-6 text-amber-600" />,
                bg: 'bg-amber-50',
                title: 'Für Nachhilfecoaches',
                items: [
                  'Profil mit Fächern und Verfügbarkeit anlegen',
                  'Buchungsanfragen annehmen oder ablehnen',
                  'Aktive Coachings im Überblick behalten',
                  'Mindestens 10€ pro Stunde verdienen',
                ],
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${card.bg} mb-5`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Häufig gestellte Fragen</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
