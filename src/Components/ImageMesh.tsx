import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect, useState } from 'react';
import glsl from "babel-plugin-glsl/macro";
import { useInterval } from 'usehooks-ts';
import useAudioContext from "./Hooks/useAudioContext";
import { ThreeElements, useLoader, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from "@react-three/drei";

const ColorShiftMaterial = shaderMaterial(
  { uTime: 0, uTexture: null, frequencies: [0, 0.25, 0.75, 0.33, 1.0] },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float frequencies[256];

    void main() {
      vUv = uv;
      vec3 texture = texture2D(uTexture, uv).rgb;

      float numberOfFrequencies = 255.0;
      int frequencyIndex = int(floor(numberOfFrequencies * texture.g ) );
      float frequency = frequencies[frequencyIndex];

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // remove value < 50.0
      float normalisedFrequency = frequency > 50.0 ? (frequency / 255.0) : 0.0;
      modelPosition.z += normalisedFrequency;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec3 texture = texture2D(uTexture, vUv).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
)

// declaratively
extend({ ColorShiftMaterial })

interface ImageMeshProps {
  base64Texture: string;
  meshProps: ThreeElements['mesh'];
}

function ImageMesh({meshProps, base64Texture }: ImageMeshProps) {
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
      <colorShiftMaterial wireframe={true}  side={THREE.BackSide}  ref={refMaterial} uTexture={texture} />

      </mesh>
  )
}

export default ImageMesh;