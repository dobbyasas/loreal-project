import React from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

import Header from '../Components/Header';

const Video = () => {
  const { videoName } = useParams();

  return (
    <div>
     <Header />
     <h1>{videoName}</h1>
      <ReactPlayer
        url={`/videos/${videoName}.mp4`}
        controls={true}
        playing={true}
        width="100%"
        height="auto"
      />
    </div>
  );
};

export default Video;
