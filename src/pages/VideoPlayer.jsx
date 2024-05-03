import React from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

import Header from '../Components/Header';

const VideoPlayer = () => {
  const { url } = useParams(); 

  return (
    <div>
     <Header />
     <div>
        <ReactPlayer url={decodeURIComponent(url)} controls width="100%" height="100%" />
      </div>
    </div>
  );
};

export default VideoPlayer;
