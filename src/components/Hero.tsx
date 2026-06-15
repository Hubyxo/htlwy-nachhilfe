import React from 'react';
import { ArrowRight, Sparkles, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Hero: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-[#050d1a]">
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid-dark" />

      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050d1a] to-transparent pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050d1a] to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-up flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
              <Sparkles size={14} className="text-blue-400" />
              HTL Waidhofen/Ybbs — Nachhilfeplattform
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Nachhilfe von{' '}
              <span className="relative inline-block">
                <span className="gradient-text-light">Schülern</span>
              </span>
              <br />
              für{' '}
              <span className="gradient-text-light">Schüler</span>
            </h1>
            <p className="animate-fade-up delay-200 text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
              Die Nachhilfeplattform der HTL Waidhofen/Ybbs. Melde dich als Coach an, wähle deine Fächer —
              und Schüler können dich direkt buchen.
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            {isAuthenticated ? (
              <>
                <Link
                  to="/tutor-werden"
                  className="group flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Nachhilfecoach werden
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/nachhilfecoaches"
                  className="group flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-200 px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-600/30 hover:border-blue-400/50 transition-all duration-200"
                >
                  <BookOpen size={16} />
                  Coaches entdecken
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-base hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Mit Microsoft anmelden
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="animate-fade-up delay-400 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: <Users size={20} />, value: '100%', label: 'HTL-Schüler' },
              { icon: <BookOpen size={20} />, value: '12+', label: 'Fächer' },
              { icon: <Sparkles size={20} />, value: '10€+', label: 'Pro Stunde' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors duration-200"
              >
                <div className="text-blue-400 flex justify-center mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-blue-200/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-800">
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent animate-pulse-slow" />
      </div>
    </div>
  );
};

export default Hero;
