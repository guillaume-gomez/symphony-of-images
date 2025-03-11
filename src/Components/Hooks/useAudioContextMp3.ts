import { useRef, useEffect } from "react";
import useAudioContext from "../Reducer/useAudioContext";

interface useAudioContextMp3Props {
  frequencySize: number;
  onUpdate: () => void;
}

function useAudioContextMp3({ onUpdate } : useAudioContextMp3Props) {
  const animationRef = useRef();
  const { state: { audio, analyzer, frequencySize } } = useAudioContext();

  console.log("ndfaudio")

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    console.log(audio.paused)
    if(audio.paused && animationRef.current) {
      console.log("paused")
      return cancelAnimationFrame(animationRef.current)
    }
    if(!audio.paused) {
      console.log("play")
      play()
    }
  }, [audio?.paused])


  function play() {
    animationRef.current = window.requestAnimationFrame(play);
    if (animationRef.current && !audio) {
      return cancelAnimationFrame(animationRef.current);
    }
    const data = new Uint8Array(frequencySize);
    analyzer.getByteFrequencyData(data);
    onUpdate(data);
  };

  return { play };

}

export default useAudioContextMp3;