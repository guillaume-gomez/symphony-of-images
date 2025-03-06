import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect, useState } from 'react';
import glsl from "babel-plugin-glsl/macro";
import { useInterval } from 'usehooks-ts';
import useAudioContext from "./Hooks/useAudioContextMp3";
import { ThreeElements, useLoader, extend, useFrame } from '@react-three/fiber';
import ColorShiftMaterial from "./ColorShiftMaterial";

// to notify to three-js (it will not work without)
extend({ ColorShiftMaterial })

interface ImageMeshProps {
  base64Texture: string;
  filter: float;
  amplitude: float;
  wireframe: boolean;
  meshSize: number;
}

function ImageMesh({base64Texture, filter, amplitude, wireframe, meshSize }: ImageMeshProps) {
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
    handleAudioPlay();
  }, [base64Texture]);

  const refMaterial = useRef();

  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);

  const { handleAudioPlay } = useAudioContext({
    frequencySize: 256,
    onUpdate(data) {
      refMaterial.current.frequencies = data;
    }
  });

  if(!texture) {
    return <></>;
  }


  return (
    <mesh
      position={[0,0,0]}
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
      />
      <meshStandardMaterial attach="material-5" color="orange" />
      </mesh>
  )
}

export default ImageMesh;