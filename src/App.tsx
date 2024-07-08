import { useState } from 'react'

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
      <h1>{konami ? "KONAMI" : "Vite + React"}</h1>
      <InputFileWithPreview onChange={onChange} imageBase64={imageBase64}/>
      {
        !imageBase64 ? <p>Ya rien a afficher</p> : <ThreeJSRendering depth={3} backgroundColor="#3D3E61" imageTexture={imageBase64} width={"100%"} height={800} />
      }
    </>
  )
}

export default App
