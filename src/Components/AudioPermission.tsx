import useAudioContext from "./Reducer/useAudioContext";


interface AudioPermissionProps {
}

function AudioPermission({} : AudioPermissionProps) {
 const { dispatch, state: { paused, typeOfPlay } } = useAudioContext();
  
  function onClick() {

    // turn off recording
    if(!paused) {
      dispatch({ type: 'disableMic' });
      return; 
    }

    // enable recording
    // note : As the function is async, this piece of cannot be in the reducer directly 
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then((stream) => {
        window.localStream = stream;
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyzer = audioContext.createAnalyser();
        let source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);

        dispatch({ type: 'allowMic', payload: analyzer});
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });

  }

  function isPaused() {
    // is not related to microphone
    if(typeOfPlay === "mp3") {
      return false;
    }
    return paused;
  }
  

  return (
     <button
      className={`btn ${isPaused() ? "btn-primary" : "btn-secondary"}`}
      onClick={onClick}
    >
      { isPaused() ? "Allow microphone" : "Turn off microphone" }
    </button>
  )
}

export default AudioPermission;
