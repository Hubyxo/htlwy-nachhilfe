import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

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

  const publicNavLinks = [
    { name: 'Über uns', path: '/ueber-uns' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const authenticatedNavLinks = [
    { name: 'Startseite', path: '/' },
    { name: 'Nachhilfecoach werden', path: '/tutor-werden' },
    { name: 'Nachhilfecoaches', path: '/nachhilfecoaches' },
    { name: 'Über uns', path: '/ueber-uns' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

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
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.display_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{user?.display_name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Abmelden</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Anmelden
              </Link>
            )}
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
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 py-2 border-t pt-4">
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.display_name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.display_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-base text-gray-700">{user?.display_name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  <LogOut size={18} />
                  <span className="text-base font-medium">Abmelden</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors text-base font-medium text-center"
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;