import React from 'react';

import HomeHeader from '../Components/HomeHeader';
import Videos from '../Components/Videos';

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
