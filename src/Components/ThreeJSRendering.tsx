import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { OrbitControls, Stage, GizmoHelper, GizmoViewport } from '@react-three/drei';
import ImageMesh from "./ImageMesh";
import Range from "./Range";


interface ThreejsRenderingProps {
  depth: number;
  backgroundColor: string;
  imageTexture: string;
  width: number;
  height: number;
}


function ThreejsRendering({ depth, backgroundColor, imageTexture, width, height } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const [amplitude, setAmplitude] = useState<number>(1.0);
  const [filter, setFilter] = useState<number>(10.0);
  const [meshSize, setMeshSize] = useState<number>(256);
  const [wireframe, setWireframe] = useState<boolean>(true);


  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Settings</h2>
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
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Wireframe</span>
              <input type="checkbox" className="toggle" checked={wireframe} onClick={() => setWireframe(!wireframe)} />
            </label>
          </div>
        </div>
      </div>
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 35, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        style={{width, height}}
      >
        <color attach="background" args={[backgroundColor]} />
        <Stage
          intensity={0.5}
          preset="rembrandt"
          shadows={{ type: 'accumulative', color: '#8B7D41', colorBlend: 2, opacity: 1 }}
          >
          <group
            position={[
            0, 0, 0]}
          >
            <ImageMesh
              base64Texture={imageTexture}
              wireframe={wireframe}
              amplitude={amplitude}
              meshSize={meshSize}
              filter={filter}
            />
          </group>
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.9} makeDefault />
          <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Stage>
      </Canvas>
    </div>
  );
}

export default ThreejsRendering;