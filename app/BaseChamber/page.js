"use client";

import React from "react";
import Navbar from "./Navbar";
import { motion } from "motion/react";
import Agent from "./Agent";
import Link from "next/link";

const BaseChamber = () => {
  const titleStyle = {
    fontFamily: '"Orbitron", sans-serif',
    fontSize: "3.2rem",
    fontStyle: "italic",
    color: "#CED9E7",
    textShadow:
      "0px 0px 10px rgba(0, 255, 153, 0.7), 0px 0px 20px rgba(0, 255, 153, 0.7)",
    letterSpacing: "2px",
    textAlign: "center",
    marginTop: "5px",
  };

  return (
    <div>
      <Navbar />
      <motion.h1
        style={titleStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 1,
        }}
      >
        BASE CHAMBER
      </motion.h1>
      <motion.div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "76vh",
          background: "linear-gradient(to bottom, #0a0f1b, #0d1a2d, #0d1a2d)",
          backgroundSize: "cover",
          color: "#fff",
          fontFamily: "Orbitron",
        }}
        className="chamber"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <img
          style={{
            width: "20px",
            position: "absolute",
            left: "10px",
            top: "10px",
          }}
          src="/screw.png"
        ></img>
        <img
          style={{
            width: "20px",
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
          src="/screw.png"
        ></img>
        <img
          style={{
            width: "20px",
            position: "absolute",
            left: "10px",
            bottom: "10px",
          }}
          src="/screw.png"
        ></img>
        <img
          style={{
            width: "20px",
            position: "absolute",
            right: "10px",
            bottom: "10px",
          }}
          src="/screw.png"
        ></img>
        <Agent name={"N.O.V.A"} />
        <Agent name={"L.U.N.A"} />
        <Link href={" /BaseChamber/Replica"}>
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.05,

              transition: { duration: 0.3 },
            }}
            className="text-5xl font-extrabold text-blue-500 hover:text-blue-300 
                 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 
                 bg-clip-text text-transparent p-6 rounded-xl 
                 border-4 border-beige-300 shadow-xl 
                 transition-all duration-500 ease-in-out hover:h-32"
          >
            REPLICA
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default BaseChamber;
