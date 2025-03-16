import React, { useRef } from 'react';
import useAudioContext from "./Reducer/useAudioContext";

interface Mp3PlayerInterface {
}

function Mp3Player({ } : Mp3PlayerInterface): React.ReactElement {
  const audioRef = useRef();
  const { state: { audio }, dispatch } = useAudioContext();

  function handleFiles(event) {
    const file = event.target.files[0];
    if (file) {
      const mp3File = URL.createObjectURL(file);
      dispatch({type: "importMp3", payload: mp3File })
    }
  }

  return (
    <div className="form-control flex flex-row gap-2 items-center">
      <input type="file" onChange={handleFiles} accept="audio/*" />
      <audio
        src={audio?.src}
        id="audio"
        controls
        onPlay={() => { console.log("run play"); dispatch({type: "play" }) }}
        onPause={() => { console.log("run play"); dispatch({type: "pause" }) }}
      >
      </audio>
    </div>
  );
}

export default Mp3Player;