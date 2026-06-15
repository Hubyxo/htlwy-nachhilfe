import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white">
      {/* CTA band */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Bereit loszulegen?</h3>
              <p className="text-gray-400 text-sm">Melde dich mit deinem HTL-Account an – kostenlos und sofort.</p>
            </div>
            <Link
              to="/login"
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg flex-shrink-0"
            >
              Jetzt anmelden
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/Logo_HTLWaidhofen.png" alt="HTL Logo" className="h-8 w-auto brightness-0 invert opacity-80" />
              <span className="text-base font-bold text-white">HTL Nachhilfe</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Die Nachhilfeplattform der HTL Waidhofen/Ybbs — Schüler buchen Coaches direkt.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/htlwaidhofen"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/htlwaidhofen"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344a3.09 3.09 0 0 0-1.15.748 3.09 3.09 0 0 0-.747 1.15c-.137.353-.3.882-.344 1.857-.048 1.055-.059 1.37-.059 4.04 0 2.672.01 2.987.059 4.04.045.977.207 1.505.344 1.858.181.467.398.8.748 1.15.35.35.683.567 1.15.748.352.137.881.3 1.857.344 1.054.048 1.37.059 4.04.059 2.672 0 2.987-.01 4.04-.059.977-.045 1.505-.207 1.858-.344a3.1 3.1 0 0 0 1.15-.748 3.09 3.09 0 0 0 .748-1.15c.137-.353.3-.881.344-1.857.048-1.054.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.976-.207-1.504-.344-1.857a3.09 3.09 0 0 0-.748-1.15 3.1 3.1 0 0 0-1.15-.747c-.353-.137-.881-.3-1.857-.344-1.054-.048-1.37-.059-4.04-.059z" />
                  <path d="M12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm6.538-8.669a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Startseite', path: '/' },
                { label: 'Coach werden', path: '/tutor-werden' },
                { label: 'Nachhilfecoaches', path: '/nachhilfecoaches' },
                { label: 'Über uns', path: '/ueber-uns' },
                { label: 'Kontakt', path: '/kontakt' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-500 text-sm hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Rechtliches</h4>
            <ul className="space-y-3">
              {[
                { label: 'Impressum', path: '/impressum' },
                { label: 'Datenschutz', path: '/datenschutz' },
                { label: 'Verwaltung', path: '/admin/login' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-500 text-sm hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">Im Vogelsang 8, 3340 Waidhofen/Ybbs</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 text-sm">oliver.spring@htlwy.at</span>
              </li>
              <li className="flex items-center gap-3">
                <ExternalLink size={15} className="text-gray-500 flex-shrink-0" />
                <a href="https://www.htlwy.at" className="text-gray-500 text-sm hover:text-white transition-colors duration-200">
                  www.htlwy.at
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} HTL Waidhofen/Ybbs. Alle Rechte vorbehalten.
          </p>
          <p className="text-gray-600 text-xs">
            Entwickelt von{' '}
            <a href="mailto:elias.scheidl@htlwy.at" className="hover:text-gray-400 transition-colors">Elias Scheidl</a>
            {' '}&amp;{' '}
            <a href="mailto:oliver.spring@htlwy.at" className="hover:text-gray-400 transition-colors">Oliver Spring</a>
            {' '}— Schülervertretung HTL Waidhofen/Ybbs
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
