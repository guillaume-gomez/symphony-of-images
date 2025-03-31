import { useState } from 'react';
import AudioPermission from "./Components/AudioPermission";
import ThreeJSRendering from "./Components/ThreeJSRendering";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import Range from "./Components/Range";
import Toggle from "./Components/Toggle";
import ColorPicker from "./Components/ColorPicker";
import Mp3Player from "./Components/Mp3Player";
import Card from "./Components/Card";
import BadgeTitle from "./Components/BadgeTitle";
import AppContextProvider from "./Components/Reducer/AudioReducer";

function App() {
  const [imageBase64, setImageBase64] = useState<string|null>(null);
  const [amplitude, setAmplitude] = useState<number>(1.0);
  const [filter, setFilter] = useState<number>(10.0);
  const [meshSize, setMeshSize] = useState<number>(256);
  const [wireframe, setWireframe] = useState<boolean>(true);
  const [invertColor, setInvertColor] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("#000000");

  
  function onChange(imageBase64: string) {
    setImageBase64(imageBase64);
  }

  return (
    <div className="animate-gradient bg-[length:200%_200%] min-h-screen h-full bg-radial-[at_50%_50%] from-zinc-700 to-zinc-900 to-55%">
      <div className="container m-auto flex flex-col gap-5">
        <h1 className="p-2 text-4xl font-title">Vo Image</h1>
        <AppContextProvider>
          <div className="flex flex-col gap-5">
            <Card title="Sound settings">
              <div className="flex w-full flex-col lg:flex-row">
                <div className="card rounded-box grid h-44 grow place-items-center w-6/12" style={{background: "var(--color-base-400)"}}>
                  <BadgeTitle number={1} text={"Upload an image"} />
                  <InputFileWithPreview
                    onChange={onChange}
                    imageBase64={imageBase64}
                  />

                </div>
                <div className="divider lg:divider-horizontal">
                  <div className="badge badge-primary badge-md rounded">Then</div>
                </div>
                <div className="card rounded-box grid h-44 grow place-items-center w-6/12 p-2" style={{background: "var(--color-base-400)"}}>
                  <BadgeTitle number={2} text={"Upload mp3 file or enable microphone"} />
                  <Mp3Player />
                  <AudioPermission />
                </div>
              </div>
            </Card>
            <Card title="Settings">
              <Range
                label="Mesh Size"
                value={meshSize}
                min={16}
                max={256}
                step={1}
                onChange={setMeshSize}
              />
              <Range
                label="Amplitude"
                float
                value={amplitude}
                min={0.1}
                max={2.0}
                step={0.01}
                onChange={setAmplitude}
              />
              <Range
                label="Filter"
                float
                value={filter}
                min={0.0}
                max={255}
                step={0.5}
                onChange={setFilter}
              />
              <ColorPicker
                label="Background color"
                value={background}
                onChange={(value: string) => setBackground(value)}
              />
              <Toggle
                label={"Wireframe"}
                onToggle={(value: boolean) => setWireframe(value)}
                value={wireframe}
              />
              <Toggle
                label={"Invert Color"}
                onToggle={(value : boolean) => setInvertColor(value)}
                value={invertColor}
              />
            </Card>
            {
              !imageBase64 ? 
                <div className="flex flex-col gap-5 items-center">
                  <span className="loading loading-bars w-16 text-primary"></span>
                  <span>Upload an Image</span>
                </div> :
                <ThreeJSRendering
                  backgroundColor={background}
                  imageTexture={imageBase64}
                  amplitude={amplitude}
                  filter={filter}
                  meshSize={meshSize}
                  wireframe={wireframe}
                  invertColor={invertColor}
                />
            }
          </div>
        </AppContextProvider>
      </div>
    </div>
  )
}

export default App
