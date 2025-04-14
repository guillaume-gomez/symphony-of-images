import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3 } from "three";
import Card from "./Card";
import Range from "./Range";
import Toggle from "./Toggle";
import ColorPicker from "./ColorPicker";
import Select from "./Select";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport } from '@react-three/drei';
import ImageMesh from "./ImageMesh";
import RecordScene from "./RecordScene";
import useAudioContext from "./Reducer/useAudioContext";


interface ThreejsRenderingProps {
  imageTexture: string;
}


function ThreejsRendering({
    imageTexture,
  } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const { state: { audio } } = useAudioContext();

  const meshRef = useRef<Mesh>(null);
  const maxDistance = useRef<number>(500);
  const cameraControlRef = useRef<CameraControls>(null);
  const [amplitude, setAmplitude] = useState<number>(0.2);
  const [filter, setFilter] = useState<number>(0.0);
  const [meshSize, setMeshSize] = useState<number>(64);
  const [wireframe, setWireframe] = useState<boolean>(true);
  const [invertColor, setInvertColor] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("#000000");
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [rotationY, setRotationY] = useState<boolean>(false);
  const [rendering, setRendering] = useState<number>(0);

  useEffect(() => {
    if(!meshRef.current) {
      return;
    }
    centerCamera(meshRef.current)
  }, [imageTexture, meshRef])

  async function centerCamera(mesh : Mesh) {
    if(cameraControlRef.current) {
      cameraControlRef.current.maxDistance = 500;
      await cameraControlRef.current.setLookAt(
        0, 0, 1,
        0,0, 0,
        false
      );
      await cameraControlRef.current.fitToBox(mesh, true,
        { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 }
      );
      let distanceCamera = new Vector3();
      cameraControlRef.current.getPosition(distanceCamera, false);
      maxDistance.current = distanceCamera.z + 1.5;
    }
  }

  return (
    <div className="relative w-full h-screen">

      <Canvas
        camera={{ position: [0, 0.0, 3], fov: 50, far: 100 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
      >
        <color attach="background" args={[background]} />
        <Stage
          intensity={0.5}
          preset="upfront"
          adjustCamera={false}
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
              invertColor={invertColor}
              rendering={rendering}
              rotationY={rotationY}
              meshRef={meshRef}
            />
          </group>
          <CameraControls
              minPolarAngle={0.65}
              maxPolarAngle={Math.PI / 1.9}
              minAzimuthAngle={-0.65}
              maxAzimuthAngle={0.65}
              makeDefault
              maxDistance={maxDistance.current}
              ref={cameraControlRef}
            />
          <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Stage>
      </Canvas>

      <div className="absolute left-5 top-5">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-ghost btn-sm">
            {showSettings ? "hide" : "show" }
        </button>
        
          <div id="expand-settings" className={ showSettings ? "expanded" : ""}>
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
              max={1.0}
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
            <Select
              label={"Rendering"}
              value={rendering}
              onChange={(newRendering) => setRendering(newRendering)}
              options={[
                {value: 0, label: "Color"},
                {value: 1, label: "Circle"}
              ]}
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
            <Toggle
              label={"Rotation Y"}
              onToggle={(value : boolean) => setRotationY(value)}
              value={rotationY}
            />
            <RecordScene canvasRef={canvasRef} audio={audio} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ThreejsRendering;