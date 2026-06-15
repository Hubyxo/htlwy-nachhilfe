import React from 'react';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const contacts = [
    {
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600',
      title: 'Adresse',
      lines: ['HTL Waidhofen/Ybbs', 'Im Vogelsang 8', '3340 Waidhofen an der Ybbs'],
    },
    {
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-emerald-100 text-emerald-600',
      title: 'E-Mail',
      lines: ['nachhilfe.htlwy@gmail.com', 'oliver.spring@htlwy.at'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid-dark" />
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-600/15 rounded-full blur-[90px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Kontakt</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Schreib uns</h1>
            <p className="text-blue-100/60 text-lg">
              Fragen zur Plattform oder zum Nachhilfeprogramm? Melde dich gerne.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 max-w-2xl mx-auto">
            {contacts.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${c.color} mb-4`}>
                  {c.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
                {c.lines.map((line, i) => (
                  <p key={i} className="text-sm text-gray-500">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Website link */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex items-center justify-between gap-4 text-white">
            <div>
              <p className="font-semibold mb-1">HTL Waidhofen/Ybbs Website</p>
              <p className="text-sm text-blue-100/70">Offizielle Website der HTL Waidhofen/Ybbs</p>
            </div>
            <a
              href="https://www.htlwy.at"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0"
            >
              <ExternalLink size={14} />
              www.htlwy.at
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
