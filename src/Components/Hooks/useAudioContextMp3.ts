import { useRef, useEffect } from "react";
import useAudioContext from "../Reducer/useAudioContext";

interface useAudioContextMp3Props {
  frequencySize: number;
  onUpdate: () => void;
}

function useAudioContextMp3({ onUpdate } : useAudioContextMp3Props) {
  const animationRef = useRef();
  const { state: { typeOfPlay, audio, analyzer, frequencySize, paused } } = useAudioContext();

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    if(paused && animationRef.current) {
      console.log("paused")
      cancelAnimationFrame(animationRef.current);

      // send 0 de get back to original image
      const emptyData = Array(frequencySize).fill(0)
      onUpdate(emptyData)
    }
    if(!paused) {
      console.log("play")
      play()
    }
  }, [audio?.paused])


  function play() {
    animationRef.current = window.requestAnimationFrame(play);
    if (paused && animationRef.current) {
      return cancelAnimationFrame(animationRef.current);
    }
    const data = new Uint8Array(frequencySize);
    analyzer.getByteFrequencyData(data);
    console.log(data)
    onUpdate(data);
  };

  return { play };

}

export default useAudioContextMp3;