import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import '../styles/Videos.scss';
import '../data/video.json';

const supabaseUrl = 'https://qlwylaqkynxaljlctznm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3lsYXFreW54YWxqbGN0em5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNTcyMzEsImV4cCI6MjAyOTYzMzIzMX0.IDuXkcQY163Nrm4tWl8r3AMHAEetc_rdz4AyBNuJRIE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


const Videos = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    async function getVideos() {
        const { data, error } = await supabase
            .storage
            .from('videakrystof')
            .list('');

        if (data) {
            const urls = await Promise.all(data.map(async (file) => {
                const { publicURL, error } = supabase.storage.from('videakrystof').getPublicUrl(file.name);
                return { name: file.name, url: publicURL };
            }));
            setVideos(urls);
        } else {
            console.log(error);
            alert("Error getting videos");
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

    useEffect(() => {
      fetch('/data/videos.json')
          .then(response => response.json())
          .then(data => setVideos(data))
          .catch(error => console.error('Error loading the videos data:', error));
  }, []);


    const handleVideoClick = (fileName) => {
      navigate(`/video/${encodeURIComponent(fileName)}`);
    };

    return (
      <div className="video-gallery">
      {videos.map(video => (
          <div className="video-item" key={video.id} onClick={() => handleVideoClick(video.fileName)}>
              <img key={video.id} src={video.thumbnail} alt={`Thumbnail for ${video.customName}`} />
              <p>{video.customName}</p>
          </div>
          ))}
      </div>
    );
};

export default Videos;
