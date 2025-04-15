import { useState, useEffect } from "react";
import useAudioContext from "./Reducer/useAudioContext";
import AudioPermission from "./AudioPermission";
import InputFileWithPreview from "./InputFileWithPreview";
import Mp3Player from "./Mp3Player";
import BadgeTitle from "./BadgeTitle";


interface SoundSettingsFormProps {
  onSubmit: (imageBase64: string) => void;
}

function SoundSettingsForm({  onSubmit } : SoundSettingsFormProps ) {
	const { state: { audioContext } } = useAudioContext();
	const [imageBase64, setImageBase64] = useState<string|null>(null);
  const [showStepperForm, setShowStepperForm] = useState<boolean>(true);

  useEffect(() => {
    if(audioContext) {
      setShowStepperForm(false);
      onSubmit(imageBase64 as string);
    }
  }, [audioContext])


  function onChange(newImageBase64: string) {
    setImageBase64(newImageBase64);
    if(!showStepperForm) {
      onSubmit(newImageBase64);
    }
  }


	function imageSettingsCommon() {
		return(
			<>
  			<BadgeTitle number={1} text={"Upload an image"} />
        <InputFileWithPreview
          onChange={onChange}
          imageBase64={imageBase64}
  			/>
			</>
		);
	}

  function soundSettingsCommon() {
    return (
      <>
        <BadgeTitle number={2} text={"Upload mp3 file or enable microphone"} />
        <Mp3Player />
        <AudioPermission />
      </>
    )
  }

  if(showStepperForm) {
    return (
      <div className="card rounded-box grid h-44 grow place-items-center" style={{background: "var(--color-base-400)"}}>
        {
          !imageBase64 ? imageSettingsCommon() : soundSettingsCommon()
        }
      </div>
    )
  }

	return (
		<div className="flex w-full flex-col lg:flex-row">
	    <div className="card rounded-box grid h-44 grow place-items-center lg:w-6/12" style={{background: "var(--color-base-400)"}}>
					{imageSettingsCommon()}
		   </div>
			  <div className="divider lg:divider-horizontal">
			    <div className="badge badge-primary badge-md rounded">Then</div>
			  </div>
				<div className="card rounded-box grid h-44 grow place-items-center lg:w-6/12 p-2" style={{background: "var(--color-base-400)"}}>
					{soundSettingsCommon()}
				</div>
	   </div>
    );
}

export default SoundSettingsForm;