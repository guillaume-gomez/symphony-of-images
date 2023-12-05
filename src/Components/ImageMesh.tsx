import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useSpring, animated } from '@react-spring/three';
import React, { useRef, useEffect, useState } from 'react';
import glsl from "babel-plugin-glsl/macro";
import { useInterval } from 'usehooks-ts';
import { ThreeElements, useLoader, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from "@react-three/drei"

const ColorShiftMaterial = shaderMaterial(
  { uTime: 0, color: new THREE.Color(0.2, 0.0, 0.1), uTexture: null, frequencies: [0, 0.25, 0.75, 0.33, 1.0] },
  // vertex shader
  /*glsl*/`


    varying vec2 vUv;
    uniform float uTime;
    uniform float frequencies[5];
    uniform vec2 uResolution;

    void main() {
      vUv = uv;
      float numberOfFrequencies = 6.0;
      int frequencyIndex = int(floor(numberOfFrequencies * uv.x));
      float frequency = frequencies[frequencyIndex];

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.z += frequency;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float uTime;
    uniform vec3 color;
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
  const refMaterial = useRef();
  useFrame(({ clock }) => (refMaterial.current.uTime = clock.getElapsedTime()));

  const [texture] = useLoader(TextureLoader, [
    base64Texture
  ]);

   useInterval(
    () => {
      // Your custom logic here
      refMaterial.current.frequencies = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    },
    // Delay in milliseconds or null to stop it
    1000
  )

  if(!texture) {
    return <></>;
  }

  return (
    <animated.mesh
      position={position as any}
      ref={mesh}
      /*{...meshProps}*/
    >
      <boxGeometry args={[width, height, 0.1, 256, 256, 1]} />
      <colorShiftMaterial color="hotpink" wireframe={true} ref={refMaterial} uTexture={texture} />

      </animated.mesh>
  )
}

export default ImageMesh;