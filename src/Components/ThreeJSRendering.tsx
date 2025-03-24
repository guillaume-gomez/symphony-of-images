import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3 } from "three";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport } from '@react-three/drei';
import ImageMesh from "./ImageMesh";


interface ThreejsRenderingProps {
  backgroundColor: string;
  imageTexture: string;
  amplitude: number;
  filter: number;
  meshSize: number;
  wireframe: boolean;
}


function ThreejsRendering({
    backgroundColor,
    imageTexture,
    amplitude,
    filter,
    meshSize,
    wireframe
  } : ThreejsRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const meshRef = useRef<Mesh>(null);
  const maxDistance = useRef<number>(500);
  const cameraControlRef = useRef<CameraControls>(null);

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
        { paddingLeft: 1, paddingRight: 1, paddingBottom: 2, paddingTop: 2 }
      );
      let distanceCamera = new Vector3();
      cameraControlRef.current.getPosition(distanceCamera, false);
      maxDistance.current = distanceCamera.z + 5.0;
    }
  }


  return (
    <div className="flex flex-col gap-5 w-full h-screen">
      <Canvas
        camera={{ position: [0, 0.0, 3], fov: 50, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
      >
        <color attach="background" args={[backgroundColor]} />
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
              meshRef={meshRef}
            />
          </group>
          <CameraControls
              /*minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.9}
              minAzimuthAngle={-0.55}
              maxAzimuthAngle={0.55}*/
              makeDefault
              maxDistance={maxDistance.current}
              ref={cameraControlRef}
            />
          <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Stage>
      </Canvas>
    </div>
  );
}

export default ThreejsRendering;