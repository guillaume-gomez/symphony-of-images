import React, { useRef , useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import ImageMesh from "./ImageMesh"


interface ThreejsRenderingProps {
  depth: number;
  backgroundColor: string;
  imageTexture: string;
  width: number;
  height: number;
}


function ThreejsRendering({ depth, backgroundColor, imageTexture, width, height } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="flex flex-col gap-5 w-full">
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 35, far: 5 }}
        dpr={window.devicePixelRatio}
        //onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >
        <color attach="background" args={['skyblue']} />
        <Stage
          intensity={0.5}
          preset="rembrandt"
          shadows={{ type: 'accumulative', color: 'skyblue', colorBlend: 2, opacity: 1 }}
          adjustCamera={1}
          environment="city">
          <group
            position={[
            0, 0, 0]}
          >
            <ImageMesh
              base64Texture={imageTexture}
              meshProps={{position: [0,0,0]}}
              amplitude={1.0}
              filter={10.0}
            />
          </group>
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.9} makeDefault />
        </Stage>
      </Canvas>
    </div>
  );
}

export default ThreejsRendering;