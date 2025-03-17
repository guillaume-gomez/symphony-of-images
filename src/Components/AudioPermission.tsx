interface AudioPermissionProps {
}

function AudioPermission({} : AudioPermissionProps) {

  function onClick() {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream;
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyzer.current = audioContext.createAnalyser();
      source.current = audioContext.createMediaStreamSource(stream);
      source.current.connect(analyzer.current);


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
