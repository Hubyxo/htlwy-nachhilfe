import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content:
        'Als Nachhilfecoach konnte ich nicht nur mein Wissen weitergeben, sondern auch meine eigenen Fähigkeiten verbessern. Es ist eine tolle Erfahrung, anderen zu helfen.',
      author: 'Max Müller',
      role: '5AHITN',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      content:
        'Die Nachhilfe hat mir sehr geholfen. Meine Noten haben sich deutlich verbessert, und ich verstehe den Stoff jetzt viel besser.',
      author: 'Anna Huber',
      role: '2AHWIM',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      content:
        'Es ist einfacher, von jemandem zu lernen, der ähnliche Erfahrungen gemacht hat. Mein Nachhilfecoach erklärt die Inhalte so, dass ich sie wirklich verstehen kann.',
      author: 'Thomas Bauer',
      role: '3AHET',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Stimmen</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Was andere sagen</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Erfahrungen von Coaches und Schülern, die bereits dabei sind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative p-7 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Quote icon */}
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                  <Quote size={18} className="text-blue-500" />
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                "{t.content}"
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all duration-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
