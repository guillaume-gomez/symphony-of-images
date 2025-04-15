import { RefObject } from "react";
import useRecordScene from "./Hooks/useRecordScene";
import PlaySVG from "../CustomSVG/play.svg";
import StopSVG from "../CustomSVG/stop.svg";

interface RecordSceneProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

function RecordScene({ canvasRef }: RecordSceneProps) {
  /*const videoRef = useRef<HTMLVideoElement>(null);*/
  const { stopRecord, startRecord, download, isRecording } = useRecordScene({ canvasRef, /*videoRef*/ });

	return (
			<div className="join btn-xs">
				<button
					className="btn btn-outline btn-primary join-item"
					disabled={isRecording}
					onClick={startRecord}
				>
					Record
					<PlaySVG />
				</button>
				<button
					className="btn btn-outline btn-accent  join-item"
					disabled={!isRecording}
					onClick={stopRecord}
				>
					Stop
					<StopSVG  />
				</button>
	      <button
	      	className="btn btn-outline join-item"
	      	disabled={isRecording}
	      	onClick={download}
	      >
	      	Save
	      </button>
      	{/*<video ref={videoRef} playsInline style={{ width: 200, height: 100}}/>*/}
	     </div>
	)

}

export default RecordScene; 