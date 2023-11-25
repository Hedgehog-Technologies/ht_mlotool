import { useEffect, useRef } from "react";
import { fetchNui } from "../utils/fetchNui";
import { noop } from "../utils/misc";

type FrameVisibleSetter = (bool: boolean) => void;

const LISTENED_KEYS = ['Escape'];

export const useExitListener = (visibleSetter: FrameVisibleSetter, cb?: () => void) => {
  const setterRef = useRef<FrameVisibleSetter>(noop);

  useEffect(() => {
    setterRef.current = visibleSetter;
  }, [visibleSetter]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (LISTENED_KEYS.includes(e.code)) {
        setterRef.current(false);
        cb && cb();
        fetchNui('ht_mlotool:exitMLO');
      }
    };

    window.addEventListener('keyup', keyHandler);

    return () => window.removeEventListener('keyup', keyHandler);
  }, []);
};
