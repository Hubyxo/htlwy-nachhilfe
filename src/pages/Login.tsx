import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircleAlert as AlertCircle, BookOpen, Users, Award } from 'lucide-react';

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0H0V10H10V0Z" fill="#F25022" />
    <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
    <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
    <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
  </svg>
);

const Login: React.FC = () => {
  const { user, isLoading: authLoading, signInWithAzure } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      sessionStorage.setItem('redirectAfterLogin', '/');
      await signInWithAzure();
    } catch (e: any) {
      console.error('Login failed:', e);
      setError(`Anmeldung fehlgeschlagen: ${e.message || 'Unbekannter Fehler'}`);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-200/70 text-sm">Anmeldung wird verarbeitet...</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: <BookOpen size={16} />, text: 'Coaches nach Fach filtern' },
    { icon: <Users size={16} />, text: 'Direkt Buchungsanfragen stellen' },
    { icon: <Award size={16} />, text: 'Als Coach Erfahrungen sammeln' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel – dark */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050d1a] flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-700/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-blue-900/30 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-dot-grid-dark" />

        <div className="relative z-10 max-w-sm text-center">
          <div className="flex justify-center mb-8">
            <img src="/Logo_HTLWaidhofen.png" alt="HTL Logo" className="h-16 w-auto brightness-0 invert opacity-80" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            HTL<br />
            <span className="gradient-text-light">Nachhilfe</span>
          </h1>
          <p className="text-blue-200/60 text-sm leading-relaxed mb-8">
            Die Nachhilfeplattform der HTL Waidhofen/Ybbs. Peer-to-Peer Lernen auf Augenhöhe.
          </p>

          <div className="space-y-3 text-left">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-blue-400">{f.icon}</span>
                <span className="text-sm text-white/80">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – light */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <img src="/Logo_HTLWaidhofen.png" alt="HTL Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">HTL <span className="text-blue-600">Nachhilfe</span></span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Willkommen zurück</h2>
              <p className="text-gray-500 text-sm">
                Melde dich mit deinem HTL-Account an, um fortzufahren.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <AlertCircle size={17} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3.5 px-6 rounded-xl font-semibold text-sm hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Anmeldung läuft...
                </>
              ) : (
                <>
                  <MicrosoftIcon />
                  Mit Microsoft anmelden
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-6">
              Nur für Schüler der HTL Waidhofen/Ybbs mit einem gültigen HTL-Schulaccount.
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} HTL Waidhofen/Ybbs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
