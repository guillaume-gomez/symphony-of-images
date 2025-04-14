import { useRef, useEffect } from "react";
import useAudioContext from "../Reducer/useAudioContext";

interface useAudioContextProps {
  onUpdate: (data: Uint8Array<ArrayBuffer>) => void;
}

function useAudioData({ onUpdate } : useAudioContextProps) {
  const animationRef = useRef<number>();
  const { state: { audio, analyzer, frequencySize, paused } } = useAudioContext();

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current!);
  }, []);

  useEffect(() => {
    if(paused && animationRef.current) {
      console.log("paused")
      cancelAnimationFrame(animationRef.current);

      // send 0 de get back to original image
      const emptyData = Array(frequencySize).fill(0)
      onUpdate(new Uint8Array(emptyData))
    }
    if(paused === false) {
      console.log("play")
      play()
    }

  }, [audio?.paused, paused])


  function play() {
    animationRef.current = window.requestAnimationFrame(play);
    if (paused && animationRef.current) {
      return cancelAnimationFrame(animationRef.current);
    }

    if(!analyzer) {
      return;
    }
    const bufferLength = analyzer.frequencyBinCount;
    // bufferLength = frequencies/2
    const data = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(data);
    onUpdate(data);
  };

  return { play };

}

export default useAudioData;