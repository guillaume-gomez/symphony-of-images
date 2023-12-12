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
  { uTime: 0, uTexture: null, frequencies: [0, 0.25, 0.75, 0.33, 1.0], uAmplitude: 1.0, uFilter: 50.0 },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float frequencies[256];
    uniform float uAmplitude;
    uniform float uFilter;

    void main() {
      vUv = uv;
      vec3 texture = texture2D(uTexture, uv).rgb;

      float gray = (texture.r * 0.3 + texture.g * 0.59 + texture.b * 0.11);

      float numberOfFrequencies = 256.0;
      int frequencyIndex = int(floor(numberOfFrequencies * gray ) );

      float frequency = frequencies[frequencyIndex];

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      float normalisedFrequency = frequency > uFilter ? (frequency / 255.0) : 0.0;
      modelPosition.z += normalisedFrequency * uAmplitude;

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