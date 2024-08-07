import React from 'react';

import HomeHeader from '../components/HomeHeader';
import Videos from '../components/Videos';

import '../styles/Home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <HomeHeader />
      <Videos />
    </div>
  );
};

export default Home;
