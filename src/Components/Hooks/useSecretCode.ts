import { useEffect, useState } from "react";
import useInputEvent from "./useInputEvent";

function useSecretCode(secretCode: string[]) {
  const [count, setCount] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const key = useInputEvent();

  useEffect(() => {
    if (key == null) {
      return;
    }
    if (key !== secretCode[count]) {
      setCount(0);
      return;
    }

    setCount((state) => state + 1);
    if (count + 1 === secretCode.length) {
      setSuccess(true);
    }
  }, [key]);
  
  return success;
};

export default useSecretCode;