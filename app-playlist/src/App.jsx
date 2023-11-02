import React, { useEffect, useRef, useState } from 'react';

import './style.css';

const App = () => {
  const [baseURL] = useState("https://playground.4geeks.com/apis/fake/sound/songs");
  const [songs, setSongs] = useState([]);
  const audioRef = useRef();
  const volumeRef = useRef(); //Volumen


  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch(baseURL)
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.log(error));
  }, []);

  const playSong = (url) => {
    audioRef.current.src = "https://playground.4geeks.com/apis/fake/sound/" + url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nextSong = () => {
    // Obtén el índice de la canción actual
    const currentSongUrl = audioRef.current.src;
    const currentSong = songs.find((song) => currentSongUrl.includes(song.url));
    if (!currentSong) {
      return; // La canción actual no se encontró en la lista
    }
  
    // Calcula el índice de la siguiente canción
    const currentSongIndex = songs.indexOf(currentSong);
    const nextSongIndex = (currentSongIndex + 1) % songs.length;
  
    // Obtén el URL de la siguiente canción
    const nextSong = songs[nextSongIndex];
    if (!nextSong) {
      return; // No se encontró la siguiente canción (posiblemente al final de la lista)
    }
    const nextSongUrl = "https://playground.4geeks.com/apis/fake/sound/" + nextSong.url;
  
    // Reproduce la siguiente canción
    audioRef.current.src = nextSongUrl;
    audioRef.current.play();
  };

  const prevSong = () => {
    // Obtén el índice de la canción actual
    const currentSongUrl = audioRef.current.src;
    const currentSong = songs.find((song) => currentSongUrl.includes(song.url));
    if (!currentSong) {
      return; // La canción actual no se encontró en la lista
    }
  
    // Calcula el índice de la canción anterior
    const currentSongIndex = songs.indexOf(currentSong);
    const prevSongIndex = currentSongIndex - 1;
  
    // Si el índice de la canción anterior es menor que 0, vuelve al final de la lista
    if (prevSongIndex < 0) {
      // Reproduce la última canción de la lista
      const lastSong = songs[songs.length - 1];
      const lastSongUrl = "https://playground.4geeks.com/apis/fake/sound/" + lastSong.url;
      audioRef.current.src = lastSongUrl;
    } else {
      // Obtén el URL de la canción anterior
      const prevSong = songs[prevSongIndex];
      const prevSongUrl = "https://playground.4geeks.com/apis/fake/sound/" + prevSong.url;
  
      // Reproduce la canción anterior
      audioRef.current.src = prevSongUrl;
    }
  
    audioRef.current.play();
  };

  const adjustVolume = (direction) => { // Declara una función que ajusta el volumen
    const currentVolume = audioRef.current.volume; // Obtiene el volumen actual del elemento de audio
    
    let newVolume; // Declaración de la variable para el nuevo volumen
  
    if (direction === "up") { // Comprueba la dirección (aumentar volumen)
      newVolume = Math.min(currentVolume + 0.1, 1.0); // Aumenta el volumen en 0.1, pero no más allá de 1.0 (máximo)
    } else if (direction === "down") { // Comprueba la dirección (disminuir volumen)
      newVolume = Math.max(currentVolume - 0.1, 0.0); // Disminuye el volumen en 0.1, pero no por debajo de 0.0 (mínimo)
    }
  
    audioRef.current.volume = newVolume; // Establece el nuevo volumen en el elemento de audio
    volumeRef.current.innerText = `Volumen: ${(newVolume * 100).toFixed(0)}%`; // Actualiza la visualización del volumen
  };

  
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="list-viewer">
            {songs.map((song) => (
              <div key={song.id} onClick={() => playSong(song.url)}>
                {song.name}
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="preview">
            {/* Elemento <audio> con controles nativos ocultos */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Botones personalizados */}
            <button className='custom-button' onClick={prevSong}>△</button>
            <button className='custom-button' onClick={isPlaying ? pauseSong : playSong}>
              {isPlaying ? 'll' : '▷'}
            </button>
            <button className='custom-button' onClick={nextSong}>▽</button>
          </div>
          <div>
            <button onClick={() => adjustVolume("down")}><b>-</b></button>
            <button onClick={() => adjustVolume("up")}><b>+</b></button>
          </div>
          <div ref={volumeRef}>Volumen: 100%</div>
        </div>
      </div>
    </div>
  );
};

export default App;