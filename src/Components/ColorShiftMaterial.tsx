import { shaderMaterial } from "@react-three/drei";

const ColorShiftMaterial = shaderMaterial(
  { 
    uTexture: null,
    frequencies: [0, 0.25, 0.75, 0.33, 1.0],
    uAmplitude: 1.0,
    uFilter: 50.0,
    uTypeOfFilter: 0,
    uInvertColor: false
  },
  // vertex shader
  /*glsl*/`

    float circleShape(float radius, vec2 position) {
      float value = distance(position, vec2(0.5));
      return step(radius, value);
    }


    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float frequencies[128];
    uniform float uAmplitude;
    uniform float uFilter;
    /* display lighter color first or vice-versa */
    uniform bool uInvertColor;
    uniform bool uRotationY;
    uniform int uTypeOfFilter;

    void main() {
      vUv = uv;
      vec3 texture = texture2D(uTexture, uv).rgb;

      vec3 newPosition = vec3(0.0);
      float numberOfFrequencies = 128.0;
      
      if(uTypeOfFilter == 0) {
        float gray = (texture.r * 0.3 + texture.g * 0.59 + texture.b * 0.11);

        int frequencyIndex = uInvertColor ?
          int(numberOfFrequencies) - int( floor( numberOfFrequencies * gray ) ) :
          int( floor( numberOfFrequencies * gray ) )
        ;

        float frequency = frequencies[frequencyIndex];
        float normalisedFrequency = frequency > uFilter ? (frequency / 255.0) : 0.0;

        newPosition = position + vec3(0.0, 0.0, normalisedFrequency * uAmplitude);
      
      } else {
        float pct = distance(uv,vec2(0.5));
        float frequency = frequencies[int(pct * numberOfFrequencies)];
        float normalisedFrequency = frequency > uFilter ? (frequency / 255.0) : 0.0;

        newPosition = position + vec3(0.0, 0.0, - normalisedFrequency * uAmplitude);
     }
      
      // Appliquer la transformation du modèle
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
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

export default ColorShiftMaterial;