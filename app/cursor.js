"use client";

import { frame, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef(null);
  const { x, y } = useFollowPointer(ref);

  return <motion.div ref={ref} style={{ ...ball, x, y }} />;
}

const spring = { damping: 3, stiffness: 50, restDelta: 0.001 };

export function useFollowPointer(ref) {
  const xPoint = useMotionValue(0);
  const yPoint = useMotionValue(0);
  const x = useSpring(xPoint, spring);
  const y = useSpring(yPoint, spring);

  useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }) => {
      const element = ref.current;

      frame.read(() => {
        xPoint.set(clientX - element.offsetLeft - element.offsetWidth / 2);
        yPoint.set(clientY - element.offsetTop - element.offsetHeight / 2);
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return { x, y };
}

const ball = {
  width: 100,
  height: 100,
  backgroundColor: "transparent",
  boxShadow: "10px 10px 400px white",
  borderRadius: "50%",
};
