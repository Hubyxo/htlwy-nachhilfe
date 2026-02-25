import React from 'react';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import SubjectsList from '../components/SubjectsList';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <InfoSection />
      <SubjectsList />
    </div>
  );
};

export default Home;