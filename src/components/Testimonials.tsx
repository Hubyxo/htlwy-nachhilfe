import React from 'react';

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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Was andere sagen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Erfahrungen von Nachhilfecoaches und Schülern, die bereits am Nachhilfeprogramm teilgenommen haben.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">{testimonial.content}</p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;