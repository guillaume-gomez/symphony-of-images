import { useRef, useEffect } from "react";

interface useAudioContextProps {
  frequencySize: number;
  onUpdate: () => void;
}

function useAudioContext({ frequencySize, onUpdate } : useAudioContextProps) {
  const audioRef = useRef();
  const source = useRef();
  const analyzer = useRef();

  useEffect(() => {
    return () => cancelAnimationFrame(audioRef.current);
  }, []);

  function handleAudioPlay() {
    if(audioRef.current && !audioRef.current.paused) {
      return;
    }
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
      window.localStream = stream;
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyzer.current = audioContext.createAnalyser();
      if (!source.current) {
        source.current = audioContext.createMediaStreamSource(stream);
        source.current.connect(analyzer.current);
        //analyzer.current.connect(audioContext.destination);
        analyzer.current.fftSize = frequencySize;
        update();
      }
    });
  }

  function update() {
    let animationController = window.requestAnimationFrame(update);
    if (audioRef.current && audioRef.current.paused) {
      return cancelAnimationFrame(animationController);
    }
    const data = new Uint8Array(frequencySize);
    analyzer.current.getByteFrequencyData(data);
    onUpdate(data);
  };

  return { handleAudioPlay };

}

export default useAudioContext;