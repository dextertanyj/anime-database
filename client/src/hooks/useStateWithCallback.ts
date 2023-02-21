import React, { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback = <T>(
  initial: T,
): [T, (update: React.SetStateAction<T>, callback?: (state: T) => void) => void] => {
  const [state, setState] = useState<T>(initial);
  const callback = useRef<(state: T) => void>();

  useEffect(() => {
    if (callback.current && typeof callback.current === "function") {
      const cb = callback.current;
      callback.current = undefined;
      cb(state);
    }
  }, [state]);

  const setStateWithCallback = useCallback(
    (updatedState: React.SetStateAction<T>, cb?: (updatedState: T) => void) => {
      callback.current = cb;
      setState(updatedState);
    },
    [],
  );

  return [state, setStateWithCallback];
};
