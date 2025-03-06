import React, { useRef } from 'react';

interface Mp3PlayerInterface {
  onChange: (audio: Audio) => void;
}

function Mp3Player({ onChange  } : Mp3PlayerInterface): React.ReactElement {
  const audioRef = useRef();

  function handleFiles(event) {
    const file = event.target.files[0];
    if (file) {
      const mp3File = URL.createObjectURL(file);
      audioRef.current.src = mp3File;
      const audio = new Audio();
      audio.src = mp3File;
      audio.autoplay=true;
      onChange(audio);
    }
  }

  return (
    <div className="form-control flex flex-row gap-2 items-center">
      <input type="file" onChange={handleFiles} accept="audio/*" />
      <audio ref={audioRef} id="audio" controls >
      </audio>
    </div>
  );
}

export default Mp3Player;