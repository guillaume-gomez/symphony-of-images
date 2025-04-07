import useAudioContext from "./Reducer/useAudioContext";

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
    <div className="form-control flex flex-col flex-gap gap-2 border border-primary items-center rounded-xl p-2">
      <input
        className="file-input file-input-xs file-input-primary rounded-md"
        type="file"
        onChange={handleFiles} accept="audio/*"
      />
      <audio
        src={audio?.src}
        id="audio"
        controlsList="nodownload noplaybackrate"
        className="h-10 rounded-md"
        controls
        onPlay={() => { console.log("run play"); dispatch({type: "play" }) }}
        onPause={() => { console.log("run play"); dispatch({type: "pause" }) }}
      >
      </audio>
    </div>
  );
}

export default Mp3Player;