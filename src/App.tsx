import { useState } from 'react';
import ThreeJSRendering from "./Components/ThreeJSRendering";
import SoundSettingsForm from "./Components/SoundSettingsForm";
import Card from "./Components/Card";
import AppContextProvider from "./Components/Reducer/AudioReducer";
import Header from "./Components/Header";

function App() {
  const [imageBase64, setImageBase64] = useState<string|null>(null);
  const [showRendering, setShowRendering] = useState<boolean>(false);
  // todo fix animation on the setting in the three js
  
  function onSubmit(imageBase64: string) {
    setImageBase64(imageBase64);
    setShowRendering(true);
  }

  return (
    <div className="animate-gradient bg-[length:200%_200%] min-h-screen h-full bg-radial-[at_50%_50%] from-zinc-700 to-zinc-900 to-55%">
      <div className="container m-auto flex flex-col gap-5 lg:p-2 p-4">
        <Header />
        <AppContextProvider>
          <div className="flex flex-col gap-5">
            <Card title="Sound settings">
              <SoundSettingsForm onSubmit={onSubmit} />
            </Card>
            {
              !showRendering && !imageBase64 ? 
                <div className="flex flex-col gap-5 items-center">
                  <span className="loading loading-bars w-16 text-primary"></span>
                </div> :
                <ThreeJSRendering
                  imageTexture={imageBase64 as string}
                />
            }
          </div>
        </AppContextProvider>
      </div>
    </div>
  )
}

export default App
