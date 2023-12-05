import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect, useState } from 'react';
import glsl from "babel-plugin-glsl/macro";
import { ThreeElements, useLoader, extend } from '@react-three/fiber';
import { shaderMaterial } from "@react-three/drei"



interface ImageMeshProps {
  base64Texture: string;
  meshProps: ThreeElements['mesh'];
}

function ImageMesh({meshProps, base64Texture }: ImageMeshProps) {
  const [width, setWidth] = useState<number>(1);
  const [height, setHeight] = useState<number>(1);

  const [{ position }, api] = useSpring<any>(() =>({
    from: meshProps.position,
    position: meshProps.position,
    config: { mass: 0.5, tension: 500, friction: 150, precision: 0.0001 }
  }))
  useEffect(() => {
    api.start({ to: {position: meshProps.position}})
  }, [meshProps, api])
 
  useEffect(() => {
    async function computeSize() {
      let img = new Image();
      img.src = base64Texture;
      await img.decode();
      setWidth(img.width/img.height);
      setHeight(img.height/img.width);
    }
    computeSize();
  }, [base64Texture]);

  const mesh = useRef<THREE.Mesh>(null!);
  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);


  if(!texture) {
    return <></>;
  }

  return (
    <animated.mesh
      position={position as any}
      ref={mesh}
      /*{...meshProps}*/
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial map={texture} />
      </animated.mesh>
  )
}

export default ImageMesh;