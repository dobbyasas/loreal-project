import React from 'react';

import HomeHeader from '../Components/HomeHeader';
import Videos from '../Components/Videos';
import Footer from '../components/Footer';

import '../styles/Home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <HomeHeader />
      <Videos />
      <Footer />
    </div>
  );
};

export default Home;
