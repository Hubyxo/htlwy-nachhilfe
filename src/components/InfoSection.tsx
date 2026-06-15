import React from 'react';
import { BookOpen, Users, Award, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InfoSection: React.FC = () => {
  const benefits = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      title: 'Direkte Buchung',
      description:
        'Schüler suchen einen passenden Coach, sehen dessen Fächer und Verfügbarkeit – und schicken direkt eine Buchungsanfrage.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      title: 'Von Schülern für Schüler',
      description:
        'Alle Coaches sind HTL-Schüler, die den Stoff selbst kennen und auf Augenhöhe erklären können.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      title: 'Erfahrung & Anerkennung',
      description:
        'Als Coach sammelst du wichtige Soft Skills und wertvolle Erfahrung für deinen Lebenslauf.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      color: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      title: 'Flexible Zeiten',
      description:
        'Termine werden direkt zwischen Coach und Schüler per Mail ausgemacht – komplett flexibel.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Mit Microsoft anmelden',
      desc: 'Login mit deinem HTL-Account – kein extra Passwort nötig.',
    },
    {
      num: '02',
      title: 'Coach finden oder werden',
      desc: 'Stöbere durch verfügbare Coaches oder erstelle dein eigenes Coach-Profil.',
    },
    {
      num: '03',
      title: 'Buchung & Termin',
      desc: 'Schicke eine Buchungsanfrage – der Coach bestätigt, und ihr macht per Mail einen Termin aus.',
    },
  ];

  return (
    <>
      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Warum wir?</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Die Plattform, die wirklich hilft
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Einfach, direkt, auf Augenhöhe – Nachhilfe innerhalb der HTL Waidhofen/Ybbs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} text-white mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: steps */}
              <div>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Schritt für Schritt</p>
                <h2 className="text-4xl font-bold text-gray-900 mb-10">So funktioniert's</h2>
                <div className="space-y-8">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm group-hover:bg-blue-700 transition-colors duration-200">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                  >
                    Jetzt starten
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>

              {/* Right: image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl" />
                <img
                  src="https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg"
                  alt="Schüler lernen gemeinsam"
                  className="relative rounded-2xl shadow-xl w-full h-80 object-cover"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Award size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Coaches verfügbar</p>
                    <p className="text-sm font-bold text-gray-900">Jetzt buchen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;
