import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import AudioPermission from "./Components/AudioPermission";
import ThreeJSRendering from "./Components/ThreeJSRendering";
import InputFileWithPreview from "./Components/InputFileWithPreview";

import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [imageBase64, setImageBase64] = useState<string|null>(null);

  function onChange(imageBase64) {
    setImageBase64(imageBase64);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <AudioPermission onChange={() =>  console.log("ghjghgh")} />
      {
        !imageBase64 ? <p>Alice d'amour d'amour coeur coeur</p> : <ThreeJSRendering depth={3} backgroundColor="grey" imageTexture={imageBase64} />
      }
      <InputFileWithPreview onChange={onChange} imageBase64={imageBase64}/>
    </>
  )
}

export default App
