import useAudioContext from "./Reducer/useAudioContext";
import mp3 from "/mp3.svg";
interface Mp3PlayerInterface {
}

function Mp3Player({ } : Mp3PlayerInterface): React.ReactElement {
  const { state: { audio }, dispatch } = useAudioContext();

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    if(!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const mp3File = URL.createObjectURL(file);
      dispatch({type: "importMp3", payload: mp3File })
    }
  }

  return (
    <div className="form-control flex flex-row flex-gap gap-2 border border-neutral bg-primary items-center rounded-md p-2">
      <img src={mp3} />
      <div className="flex flex-col gap-1">
        <input
          className="file-input file-input-xs file-input rounded-md"
          type="file"
          onChange={handleFiles} accept="audio/*"
        />
        <audio
          src={audio?.src}
          id="audio"
          controlsList="nodownload noplaybackrate"
          className="h-10 rounded-md"
          controls
          onPlay={() => { dispatch({type: "play" }) }}
          onPause={() => { dispatch({type: "pause" }) }}
        >
        </audio>
      </div>

    </div>
  );
}

export default Mp3Player;