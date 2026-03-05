import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, BookOpen, GraduationCap, LogOut, ClipboardList, Inbox, CalendarClock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, coachProfile, logout } = useAuth();
  const isAuthenticated = !!user;
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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

  const isCoach = user?.role === 'coach' || !!coachProfile;

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
    const cls = size === 'sm'
      ? 'w-8 h-8 text-sm'
      : 'w-9 h-9 text-sm';
    return user?.profile_image_url ? (
      <img
        src={user.profile_image_url}
        alt={user.display_name}
        className={`${cls} rounded-full object-cover border border-gray-200`}
      />
    ) : (
      <div className={`${cls} rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold`}>
        {user?.display_name?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header className="fixed w-full z-30 transition-all duration-300 bg-white shadow-md py-2">
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
              <div className="flex items-center gap-2">
                <NotificationBell />
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="ring-2 ring-transparent group-hover:ring-blue-300 rounded-full transition-all duration-200">
                    <Avatar size="sm" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {user?.display_name}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleProfileNav(item.path)}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                        >
                          <item.icon size={16} className="flex-shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} className="flex-shrink-0" />
                        <span>Abmelden</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                  <Avatar size="md" />
                  <div>
                    <p className="text-base font-medium text-gray-800">{user?.display_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className="flex items-center space-x-3 py-2 text-base text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="flex items-center space-x-3 py-2 text-base text-red-600 hover:text-red-700 transition-colors border-t pt-3"
                >
                  <LogOut size={18} />
                  <span>Abmelden</span>
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
