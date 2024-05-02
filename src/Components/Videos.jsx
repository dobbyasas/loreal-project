import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactPlayer from 'react-player';
import '../styles/Videos.scss';

const supabaseUrl = 'https://qlwylaqkynxaljlctznm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3lsYXFreW54YWxqbGN0em5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNTcyMzEsImV4cCI6MjAyOTYzMzIzMX0.IDuXkcQY163Nrm4tWl8r3AMHAEetc_rdz4AyBNuJRIE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Videos = () => {
    const [videos, setVideos] = useState([]);
  
    async function getVideos() {
      const { data, error } = await supabase
        .storage
        .from('videakrystof')
        .list('')

        if(data !== null){
          setVideos(data);
          setVideos()
        } else {
          console.log(error)
          alert("Error getting videos");
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

    console.log(videos)

    return (
      <div className="video-gallery">
        {videos.map((videoURL, index) => (
          <div className="video-item" key={index}>
            <ReactPlayer key={index} url={videoURL} controls width="320px" height="240px" />
          </div>
        ))}
      </div>
    );
  };
  
  export default Videos;