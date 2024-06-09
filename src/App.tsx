import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import AudioPermission from "./Components/AudioPermission";
import ThreeJSRendering from "./Components/ThreeJSRendering";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import useKonamiCode from "./Components/Hooks/useKonamiCode";

import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [imageBase64, setImageBase64] = useState<string|null>(null);
  const konami = useKonamiCode();


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
      <h1>{konami ? "KONAMI" : "Vite + React"}</h1>
      <InputFileWithPreview onChange={onChange} imageBase64={imageBase64}/>
      {
        !imageBase64 ? <p>Ya rien a afficher</p> : <ThreeJSRendering depth={3} backgroundColor="#3D3E61" imageTexture={imageBase64} width={"100%"} height={800} />
      }
    </>
  )
}

export default App
