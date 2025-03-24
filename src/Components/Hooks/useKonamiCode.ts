import useSecretCode from "./useSecretCode";

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyQ" //--> QWERTY
];

function useKonamiCode() {
  const success = useSecretCode(konamiCode);
  return success;
};

export default useKonamiCode;

