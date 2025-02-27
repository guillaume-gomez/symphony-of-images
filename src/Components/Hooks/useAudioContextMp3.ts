import { useRef, useEffect } from "react";

interface useAudioContextMp3Props {
  frequencySize: number;
  onUpdate: () => void;
}

function useAudioContextMp3({ frequencySize, onUpdate } : useAudioContextMp3Props) {
  const audioRef = useRef();
  const source = useRef();
  const analyzer = useRef();

  useEffect(() => {
    return () => cancelAnimationFrame(audioRef.current);
  }, []);

  function handleAudioPlay(audio) {
    if(audioRef.current && !audioRef.current.paused) {
      return;
    }
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzer.current = audioContext.createAnalyser();
    if (!source.current) {
      source.current = audioContext.createMediaElementSource(audio);
      source.current.connect(analyser.current);
      analyser.current.connect(context.destination);

      analyzer.current.fftSize = frequencySize;
      update();
    }
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

export default useAudioContextMp3;