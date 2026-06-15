import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import TutorApplication from './pages/TutorApplication';
import StudentApplication from './pages/StudentApplication';
import ApplicationForm from './pages/ApplicationForm';
import CoachesList from './pages/CoachesList';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import ScrollToTop from './components/ScrollToTop';
import Profile from './pages/Profile';
import MyCoachings from './pages/MyCoachings';
import MeineCoachings from './pages/MeineCoachings';
import MyCoaches from './pages/MyCoaches';
import Buchungen from './pages/Buchungen';

function App() {
  return (
    <ThemeProvider>
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tutor-werden" element={<TutorApplication />} />
              <Route path="/tutor-werden/formular" element={<ApplicationForm type="tutor" />} />
              <Route path="/nachhilfe-finden" element={<StudentApplication />} />
              <Route path="/nachhilfe-finden/formular" element={<ApplicationForm type="student" />} />
              <Route path="/nachhilfecoaches" element={<CoachesList />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/panel" element={<AdminPanel />} />
              <Route path="/ueber-uns" element={<About />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/buchungsanfragen" element={<MyCoachings />} />
              <Route path="/meine-coachings" element={<MeineCoachings />} />
              <Route path="/meine-coaches" element={<MyCoaches />} />
              <Route path="/buchungen" element={<Buchungen />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;