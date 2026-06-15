import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, BookOpen, GraduationCap, LogOut, ClipboardList, Inbox, CalendarClock, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, coachProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = !!user;
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const publicNavLinks = [
    { name: 'Über uns', path: '/ueber-uns' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const authenticatedNavLinks = [
    { name: 'Startseite', path: '/' },
    { name: 'Coach werden', path: '/tutor-werden' },
    { name: 'Coaches', path: '/nachhilfecoaches' },
    { name: 'Über uns', path: '/ueber-uns' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;
  const isCoach = user?.role === 'coach';

  const profileMenuItems = [
    { label: 'Mein Profil', path: '/profil', icon: User, coachOnly: false, studentOnly: false },
    { label: 'Buchungsanfragen', path: '/buchungsanfragen', icon: Inbox, coachOnly: true, studentOnly: false },
    { label: 'Meine Coachings', path: '/meine-coachings', icon: ClipboardList, coachOnly: true, studentOnly: false },
    { label: 'Buchungen', path: '/buchungen', icon: CalendarClock, coachOnly: false, studentOnly: true },
    { label: 'Meine Coaches', path: '/meine-coaches', icon: GraduationCap, coachOnly: false, studentOnly: false },
  ].filter((item) => {
    if (item.coachOnly && !isCoach) return false;
    if (item.studentOnly && isCoach) return false;
    return true;
  });

  const handleProfileNav = (path: string) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
  };

  const Avatar = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
    const cls = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-sm';
    return user?.profile_image_url ? (
      <img src={user.profile_image_url} alt={user.display_name} className={`${cls} rounded-full object-cover`} />
    ) : (
      <div className={`${cls} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold`}>
        {user?.display_name?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/Logo_HTLWaidhofen.png" alt="HTL Logo" className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              HTL <span className="text-blue-600">Nachhilfe</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}

            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-200">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                aria-label="Darkmode umschalten"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                      <Avatar size="sm" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 max-w-[120px] truncate">
                        {user?.display_name}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-down">
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-50/50 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.display_name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-1.5">
                          {profileMenuItems.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => handleProfileNav(item.path)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                            >
                              <item.icon size={15} className="flex-shrink-0 text-gray-400" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut size={15} className="flex-shrink-0" />
                            <span>Abmelden</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Anmelden
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 mt-2">
                <Avatar size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.display_name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              {profileMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <item.icon size={16} className="text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => { logout(); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1 w-full"
              >
                <LogOut size={16} />
                <span>Abmelden</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
            >
              Anmelden
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full"
          >
            {theme === 'dark' ? <Sun size={16} className="text-gray-400" /> : <Moon size={16} className="text-gray-400" />}
            <span>{theme === 'dark' ? 'Heller Modus' : 'Dunkler Modus'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
