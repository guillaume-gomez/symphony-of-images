import useAudioContext from "./Reducer/useAudioContext";


interface AudioPermissionProps {
}

function AudioPermission({} : AudioPermissionProps) {
 const { dispatch, state: { paused } } = useAudioContext();
  function onClick() {
    if(!paused) {
      return; // turn off recording
    }
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
  

  return (
     <button
      className="btn btn-primary"
      onClick={onClick}
    >
      Allow microphone
    </button>
  )
}

export default AudioPermission;
