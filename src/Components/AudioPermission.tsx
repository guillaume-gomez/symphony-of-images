import { useState } from 'react'

interface AudioPermissionProps {
  onChange: () => void;
}

function AudioPermission({ onChange } : AudioPermissionProps) {
  const [count, setCount] = useState(0)

  function onClick() {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = true;
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
  }

  return (
     <button onClick={onClick}>
        Allow microphone
      </button>
  )
}

export default AudioPermission;
