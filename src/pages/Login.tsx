import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../lib/msalConfig';
import { Heater as Hero } from 'lucide-react';

const Login: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Hero className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">HTLWY Nachhilfe</h1>
            <p className="text-gray-600 mt-2">Finde deinen perfekten Nachhilfecoach oder werde selbst einer</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24h-8.4v-11h-3v-3.3h3v-1.97c0-3.47 2.14-5.37 5.23-5.37 1.49 0 2.77.1 3.14.15v3.64h-2.15c-1.69 0-2.02.8-2.02 1.98v2.6h4.04l-.53 3.3h-3.5v11z" />
              </svg>
              Mit Microsoft anmelden
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">oder</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Melde dich mit deinem Microsoft-Konto an, um als Student Nachhilfe zu finden oder als Coach dein Wissen weiterzugeben.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Durch Anmeldung akzeptierst du unsere Datenschutz- und Nutzungsbedingungen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
