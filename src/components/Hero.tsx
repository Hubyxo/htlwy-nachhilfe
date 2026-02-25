import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600 rounded-full opacity-20" />
        <div className="absolute left-1/3 top-1/4 w-24 h-24 bg-blue-500 rounded-full opacity-10" />
        <div className="absolute right-1/4 bottom-1/3 w-32 h-32 bg-blue-400 rounded-full opacity-15" />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Nachhilfe von Schülern für Schüler
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Entdecke das Nachhilfeprogramm der HTL Waidhofen/Ybbs. Werde Nachhilfecoach oder finde die Unterstützung, die du brauchst.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/tutor-werden"
              className="bg-white text-blue-700 hover:bg-gray-100 transition-colors px-6 py-3 rounded-md font-medium text-center flex items-center justify-center"
            >
              <span>Nachhilfecoach werden</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              to="/nachhilfe-finden"
              className="bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 transition-colors px-6 py-3 rounded-md font-medium text-center"
            >
              Nachhilfe finden
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;