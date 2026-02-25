import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TutorApplication from './pages/TutorApplication';
import StudentApplication from './pages/StudentApplication';
import ApplicationForm from './pages/ApplicationForm';
import CoachesList from './pages/CoachesList';
import About from './pages/About';
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutor-werden" element={<TutorApplication />} />
            <Route path="/tutor-werden/formular" element={<ApplicationForm type="tutor" />} />
            <Route path="/nachhilfe-finden" element={<StudentApplication />} />
            <Route path="/nachhilfe-finden/formular" element={<ApplicationForm type="student" />} />
            <Route path="/nachhilfecoaches" element={<CoachesList />} />
            <Route path="/ueber-uns" element={<About />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;