import { useState } from 'react';
import AudioPermission from "./Components/AudioPermission";
import ThreeJSRendering from "./Components/ThreeJSRendering";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import Mp3Player from "./Components/Mp3Player";
import Card from "./Components/Card";
import BadgeTitle from "./Components/BadgeTitle";
import AppContextProvider from "./Components/Reducer/AudioReducer";

function App() {
  const [imageBase64, setImageBase64] = useState<string|null>(null);

  
  function onChange(imageBase64: string) {
    setImageBase64(imageBase64);
  }

  return (
    <div className="animate-gradient bg-[length:200%_200%] min-h-screen h-full bg-radial-[at_50%_50%] from-zinc-700 to-zinc-900 to-55%">
      <div className="container m-auto flex flex-col gap-5">
        <h1 className="p-2 text-4xl font-title">Symphony of Images</h1>
        <AppContextProvider>
          <div className="flex flex-col gap-5">
            <Card title="Sound settings">
              <div className="flex flex-row">
                <div role="alert" className="alert alert-info alert-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{!imageBase64 ?  "Upload an Image" : "Then, add sound or enable microphone"}.</span>
                </div>
              </div>
              <div className="flex w-full flex-col lg:flex-row">
                <div className="card rounded-box grid h-44 grow place-items-center lg:w-6/12" style={{background: "var(--color-base-400)"}}>
                  <BadgeTitle number={1} text={"Upload an image"} />
                  <InputFileWithPreview
                    onChange={onChange}
                    imageBase64={imageBase64}
                  />

                </div>
                <div className="divider lg:divider-horizontal">
                  <div className="badge badge-primary badge-md rounded">Then</div>
                </div>
                <div className="card rounded-box grid h-44 grow place-items-center lg:w-6/12 p-2" style={{background: "var(--color-base-400)"}}>
                  <BadgeTitle number={2} text={"Upload mp3 file or enable microphone"} />
                  <Mp3Player />
                  <AudioPermission />
                </div>
              </div>
            </Card>
            {
              !imageBase64 ? 
                <div className="flex flex-col gap-5 items-center">
                  <span className="loading loading-bars w-16 text-primary"></span>
                </div> :
                <ThreeJSRendering
                  imageTexture={imageBase64}
                />
            }
          </div>
        </AppContextProvider>
      </div>
    </div>
  )
}

export default App
