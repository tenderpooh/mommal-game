import { useEffect, useRef } from "react";

export const usePrevious = (val) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = val;
  });
  return ref.current;
};
