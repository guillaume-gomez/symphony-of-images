import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect, useState } from 'react';
import glsl from "babel-plugin-glsl/macro";
import { useInterval } from 'usehooks-ts';
import useAudioContext from "./Hooks/useAudioContext";
import { ThreeElements, useLoader, extend, useFrame } from '@react-three/fiber';
import ColorShiftMaterial from "./ColorShiftMaterial";

// to notify to three-js (it will not work without)
extend({ ColorShiftMaterial })

interface ImageMeshProps {
  base64Texture: string;
  meshProps: ThreeElements['mesh'];
  filter: float;
  amplitude: float;
}

function ImageMesh({meshProps, base64Texture, filter, amplitude }: ImageMeshProps) {
  const [width, setWidth] = useState<number>(1);
  const [height, setHeight] = useState<number>(1);

  useEffect(() => {
    async function computeSize() {
      let img = new Image();
      img.src = base64Texture;
      await img.decode();
      setWidth(img.width/img.height);
      setHeight(img.height/img.width);
    }
    computeSize();
    handleAudioPlay();
  }, [base64Texture]);

  const refMaterial = useRef();
  useFrame(({ clock }) => (refMaterial.current.uTime = clock.getElapsedTime()));

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
      /*{...meshProps}*/
    >
      <boxGeometry args={[width, height, 0.1, 256, 256, 1]} />
      <colorShiftMaterial
        wireframe={true}
        side={THREE.BackSide}
        ref={refMaterial}
        uTexture={texture}
        uAmplitude={1.0}
        uFilter={100.0}
      />
      </mesh>
  )
}

export default ImageMesh;