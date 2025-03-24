import { useEffect, useState } from "react";

function useInputEvent()  {
  const [key, setKey] = useState<string|null>(null);
  useEffect(() => {
    
    function keyDownHandler({ code } :  KeyboardEvent) {
      setKey(code);
    }
    
    function keyUpHandler() {
      setKey(null);
    }
    
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler)
    }
  }, []);
  return key;
}

export default useInputEvent;