import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh } from "three";
import { Stage, CameraControls } from '@react-three/drei';
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
  const cameraControlRef = useRef<CameraControls|null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(500);
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    centerCamera(meshRef.current)
  }, [imageTexture, meshRef])

  async function centerCamera(mesh : InstancedMesh) {
    if(cameraControlRef.current) {
      cameraControlRef.current.maxDistance = 500;
      await cameraControlRef.current.setLookAt(
        0, 0, 1,
        0,0, 0,
        false
      );
      await cameraControlRef.current.fitToBox(mesh, true,
        { paddingLeft: 1, paddingRight: 1, paddingBottom: 2, paddingTop: 2 }
      );
      let distanceCamera = new Vector3();
      cameraControlRef.current.getPosition(distanceCamera, false);
      setMaxDistance(distanceCamera.z + 5.0);
    }
  }


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
              meshRef={meshRef}
            />
          </group>
          <CameraControls
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.9}
              minAzimuthAngle={-0.55}
              maxAzimuthAngle={0.55}
              makeDefault
              maxDistance={maxDistance}
              ref={cameraControlRef}
            />
        </Stage>
      </Canvas>
    </div>
  );
}

export default ThreejsRendering;