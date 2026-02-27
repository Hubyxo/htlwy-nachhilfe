import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/Logo_HTLWaidhofen.png" alt="HTL Logo" className="h-8 w-auto" />
              <span className="text-lg font-bold">HTL Waidhofen/Ybbs</span>
            </div>
            <p className="text-gray-300 mb-4">
              Unser Nachhilfeprogramm verbindet Schülerinnen und Schüler, um gemeinsam bessere Lernerfolge zu erzielen.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/htlwaidhofen" aria-label="Facebook" className="text-white hover:text-blue-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/htlwaidhofen" aria-label="Instagram" className="text-white hover:text-blue-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.747 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.045.976.207 1.504.344 1.857.181.466.398.8.748 1.15.35.35.683.566 1.15.747.352.137.881.3 1.857.344 1.054.048 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.976-.045 1.505-.207 1.858-.344.466-.181.8-.398 1.15-.748.35-.35.566-.683.747-1.15.137-.352.3-.881.344-1.857.048-1.054.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.976-.207-1.504-.344-1.857a3.09 3.09 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.747c-.352-.137-.881-.3-1.857-.344-1.054-.048-1.37-.059-4.04-.059z"/>
                  <path d="M12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm6.538-8.669a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-blue-300 flex-shrink-0 mt-0.5" />
                <span>Im Vogelsang 8, 3340 Waidhofen an der Ybbs</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-300 flex-shrink-0" />
                <span>+43 7442 52590</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-300 flex-shrink-0" />
                <span>office@htlwy.at</span>
              </li>
              <li className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-blue-300 flex-shrink-0" />
                <a href="https://www.htlwy.at" className="hover:text-blue-300 transition-colors">www.htlwy.at</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-300 transition-colors">Startseite</Link>
              </li>
              <li>
                <Link to="/tutor-werden" className="hover:text-blue-300 transition-colors">Nachhilfecoach werden</Link>
              </li>
              <li>
                <Link to="/ueber-uns" className="hover:text-blue-300 transition-colors">Über uns</Link>
              </li>
              <li>
                <Link to="/kontakt" className="hover:text-blue-300 transition-colors">Kontakt</Link>
              </li>
              <li>
                <Link to="/impressum" className="hover:text-blue-300 transition-colors">Impressum</Link>
              </li>
              <li>
                <Link to="/datenschutz" className="hover:text-blue-300 transition-colors">Datenschutzerklärung</Link>
              </li>
              <li>
                <Link to="/admin/login" className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                  <Lock className="h-4 w-4" />
                  Verwaltung
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-sm">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} HTL Waidhofen/Ybbs. Alle Rechte vorbehalten.</p>
          <p className="text-gray-400 mt-2">
            Ein Projekt der Schülervertretung der HTL Waidhofen/Ybbs.<br />
            Entwickelt von <a href="mailto:elias.scheidl@htlwy.at" className="hover:text-blue-300 transition-colors">Elias Scheidl</a> und <a href="mailto:oliver.spring@htlwy.at" className="hover:text-blue-300 transition-colors">Oliver Spring</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;