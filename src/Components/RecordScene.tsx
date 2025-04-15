import { useRef, RefObject } from "react";
import useRecordScene from "./Hooks/useRecordScene";

interface RecordSceneProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

function RecordScene({ canvasRef }: RecordSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stopRecord, startRecord, download } = useRecordScene({ canvasRef, videoRef });

	return (<div>
			<button
				className="btn btn-outline btn-primary btn-sm"
				onClick={startRecord}
			>
				Start Record
			</button>
			<button
				className="btn btn-outline btn-accent btn-sm"
				onClick={stopRecord}
			>
				Stop Record
			</button>
      <button className="btn btn-outline" onClick={download}>DL</button>
      <video ref={videoRef} playsInline style={{ width: 200, height: 100}}/>
		</div>
	)

}

export default RecordScene; 