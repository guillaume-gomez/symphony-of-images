import { RefObject, useRef, useEffect } from "react";

interface useRecordSceneParams {
	canvasRef: RefObject<HTMLCanvasElement>
  audioContext: AudioContext | null,
	videoRef?: RefObject<HTMLVideoElement>
}

export default function useRecordScene ({canvasRef, audio,  videoRef} : useRecordSceneParams) {
	const recordedBlobs = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder>();
  const stream = useRef<MediaStream>();
  const audioStream = useRef<AudioStream>();
  
  
	function startRecord() {
		recordedBlobs.current = [];
		try {
      stream.current = canvasRef.current.captureStream();
      if(audio) {
        {/* @ts-ignore: window.webkitAudioContext exist */}
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioStream.current = audioContext.createMediaStreamDestination();
        const sourceNode = audioContext.createMediaElementSource(audio);
        
        sourceNode.connect(audioStream.current);
        sourceNode.connect(audioContext.destination);
        
        stream.current.addTrack(audioStream.current.stream.getAudioTracks()[0]);
      }
		  mediaRecorder.current = new MediaRecorder(stream.current, {mimeType: 'video/webm'});
		} catch (e0) {
      console.error('Unable to create MediaRecorder with options Object: ', e0);
    }
    mediaRecorder.current.onstop = handleStop;
    mediaRecorder.current.ondataavailable = handleDataAvailable;
    mediaRecorder.current.start(100); // collect 100ms of data
    console.log('MediaRecorder started', mediaRecorder.current);
	}

  function handleStop(event: Event) {
    console.log('Recorder stopped: ', event);
    const superBuffer = new Blob(recordedBlobs.current, {type: 'video/webm'});
    if(videoRef) {
    	videoRef.current.src = window.URL.createObjectURL(superBuffer);
    }
  }

  function stopRecord() {
    mediaRecorder.current.stop();
    console.log('Recorded Blobs: ', recordedBlobs.current);
    if(videoRef) {
    	videoRef.current.controls = true;
    }
  }

  function handleDataAvailable(event: BlobEvent) {
    if (event.data && event.data.size > 0) {
      console.log(audioStream)
      recordedBlobs.current.push(event.data as Blob);
    }
  }


function download() {
  const blob = new Blob(recordedBlobs.current, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export-symfony-of-images.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    }, 100);
	}

  return { stopRecord, startRecord, download };
}