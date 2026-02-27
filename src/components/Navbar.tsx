import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Startseite', path: '/' },
    { name: 'Nachhilfecoach werden', path: '/tutor-werden' },
    { name: 'Nachhilfecoaches', path: '/nachhilfecoaches' },
    { name: 'Über uns', path: '/ueber-uns' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const getSignUpPath = () => {
    return '/tutor-werden/formular';
  };

  return (
    <header
      className={`fixed w-full z-30 transition-all duration-300 bg-white shadow-md py-2`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/Logo_HTLWaidhofen.png" alt="HTL Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-blue-900">Nachhilfe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={getSignUpPath()}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Jetzt anmelden
            </Link>
          </nav>

          {/* Mobile Navigation Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-screen opacity-100 visible'
            : 'max-h-0 opacity-0 invisible'
        } bg-white shadow-lg overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`py-2 text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={getSignUpPath()}
              onClick={closeMenu}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors text-base font-medium text-center"
            >
              Nachhilfe finden
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;