import { Mesh } from 'three';
import { TextureLoader } from 'three';
import { useRef, useEffect, useState, RefObject } from 'react';
import { useSpring, animated } from '@react-spring/three'
import useAudioData from "./Hooks/useAudioData";
import { useLoader, extend } from '@react-three/fiber';
import ColorShiftMaterial from "./ColorShiftMaterial";

// to notify to three-js (it will not work without)
extend({ ColorShiftMaterial })

interface ImageMeshProps {
  base64Texture: string;
  filter: number;
  amplitude: number;
  wireframe: boolean;
  meshSize: number;
  meshRef: RefObject<Mesh>;
  invertColor: boolean;
  rotationY: boolean
}

function ImageMesh({base64Texture, filter, amplitude, wireframe, meshSize, meshRef, invertColor, rotationY }: ImageMeshProps) {
  const [width, setWidth] = useState<number>(1);
  const [height, setHeight] = useState<number>(1);

  useEffect(() => {
    async function computeSize() {
      let img = new Image();
      img.src = base64Texture;
      await img.decode();
      setWidth(1);
      setHeight(img.height/img.width);
    }
    computeSize();
    play();
  }, [base64Texture]);

  const refMaterial = useRef();
  const springs = useSpring({
    rotation: rotationY ?  [-Math.PI/3,0,0] : [0,0,0],
  })

  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);

  const { play } = useAudioData({
    onUpdate(data) {
      if(!refMaterial.current) {
        return;
      }

      refMaterial.current.frequencies = data;
    }
  });

  if(!texture) {
    return <></>;
  }


  return (
    <animated.mesh
      ref={meshRef}
      position={[0,0,0]}
      rotation={springs.rotation}
    >
      <boxGeometry args={[width, height, 0.1, meshSize, meshSize, 1]} />
      <meshStandardMaterial attach="material-0" color="brown" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-1" color="red" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-2" color="green" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-3" color="purple" emissive="#000000" roughness={0} metalness={0} />
      <colorShiftMaterial
        attach="material-4"
        wireframe={wireframe}
        ref={refMaterial}
        uTexture={texture}
        uAmplitude={amplitude}
        uFilter={filter}
        uInvertColor={invertColor}
      />
      <meshStandardMaterial attach="material-5" color="orange" />
      </animated.mesh>
  )
}

export default ImageMesh;