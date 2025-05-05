import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
const Title = ({ char, xl, initPoint }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  console.log(xl);
  const box = {
    width: 250,
    height: 250,
    color: "gold",
    backgroundColor: "transparent",
    borderRadius: 10,
    position: "absolute",
    left: `-10%`,
    top: "-50px",
    fontSize: "300px",
    fontStyle: "italic",
    fontFamily: "Roboto",
  };
  console.log(initPoint);
  return (
    <motion.div
      initial={{
        x: [0],
      }}
      animate={{
        // scale: [1, 2, 1],

        x: [50, initPoint, initPoint],
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 2,
        times: [0, 0.5, 1],
        repeatDelay: 1,
      }}
      style={box}
    >
      {char}
    </motion.div>
  );
};

export default Title;
