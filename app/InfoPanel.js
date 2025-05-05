import React, { Children } from "react";
import { color, motion, useScroll, useTransform } from "motion/react";

const InfoPanel = ({ text, posArray, tp, rp, lp, name, img }) => {
  const { scrollY } = useScroll();

  const myOpacity = useTransform(scrollY, posArray, [0, 0.8, 1, 0.5, 0.1, 0]);
  const avatarPosition = useTransform(scrollY, posArray, [
    "0%",
    "10%",
    "30%",
    "40%",
    "45%",
    "50%",
  ]);
  const customColor = useTransform(scrollY, posArray, [
    "silver",
    "white",
    "white",
    "#b3b0ff",
    "#b3b0ff",
    "#b3b0ff",
  ]);

  const nameStyle = {
    margin: "10px",
    color: "#b3b0ff",
    fontSize: "40px",
    color: customColor,
  };
  const panelStyle = {
    fontFamily: "Courier",
    fontSize: "28px",
    color: "#FFF1D7",
    backdropFilter: "blur(10px)",
    backgroundColor: "#141534",
    opacity: myOpacity,
    height: "550px",
    width: "600px",
    boxShadow: "7px 7px 15px #494A6C",
    borderRadius: "50px",
    paddingTop: "40px",
    paddingLeft: "20px",
    margin: "50px",
    position: "absolute",
    top: tp,
    right: rp,
    left: lp,
  };
  return (
    <motion.div style={panelStyle}>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <center>
          <motion.h1 style={nameStyle}>{name}</motion.h1>
        </center>
        <motion.p style={{ marginTop: "50px" }}>{text}</motion.p>
        <motion.img
          src={img}
          style={{
            width: "200px",
            borderRadius: "40px",
            marginLeft: "auto",
            marginRight: "auto",
            position: "absolute",
            bottom: "5px",
            left: avatarPosition,
          }}
        ></motion.img>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
