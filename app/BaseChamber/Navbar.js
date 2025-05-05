"use client";
import React, { useState } from "react";
import { color, motion } from "framer-motion"; // Assuming you meant 'framer-motion' here
import Link from "next/link";

const Navbar = () => {
  // State to control the visibility of the sliding panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Styles for the navbar and sliding panel
  const navStyle = {
    position: "sticky",
    backdropFilter: "blur(10px)",
    zIndex: "100",
    top: "-1px",
    display: "flex",
    flexDirection: "row",
    width: "110%",
    borderStyle: "solid",
    boxShadow: "20px 2px 200px #45455D",
    borderRadius: "20px",
    borderWidth: "1px",
    marginTop: "0px",
    padding: "5px 10px 5px 10px",
    marginBottom: "20px",
    borderColor: "transparent",
    marginLeft: "-145px",
    justifyContent: "space-between",
  };

  const panelStyle = {
    position: "fixed",
    top: "80px",
    left: isPanelOpen ? "0" : "-350px", // Move in/out based on state
    width: "250px",
    height: "80vh",
    borderRadius: "50px",
    backgroundColor: "transparent",
    backdropFilter: "blur(10px)",
    border: "solid 1px silver",
    color: "silver",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    transition: "left 0.3s ease-in-out", // Smooth sliding transition
    boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.5)",
    paddingTop: "50px",
    zIndex: "50",
    gap: "0px",
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    color: "silver",
    padding: "15px 25px",
    borderBottom: "solid 2px gold",
    cursor: "pointer",
    fontSize: "18px",
    borderRadius: "5px",
    transition: "background-color 0.3s",
    width: "80%",
  };

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen); // Toggle the panel state
  };

  return (
    <div>
      <ul style={navStyle}>
        <motion.li
          style={{
            cursor: "pointer",
            padding: "5px",
            color: "silver",
            marginLeft: "150px",
            marginRight: "15px",
            fontSize: "20px",
          }}
          whileHover={{
            color: "lightyellow",
            scale: 1.1,
            transition: {
              duration: 0.1,
            },
          }}
          onClick={handlePanelToggle} // Handle click to open/close the panel
        >
          ☰
        </motion.li>
      </ul>

      {/* Sliding Panel */}
      <div style={panelStyle}>
        <Link
          href={"/"}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.button
            whileHover={{
              color: "white",
              scale: 1.1,
              transition: {
                duration: 0.1,
              },
            }}
            style={buttonStyle}
          >
            Home
          </motion.button>
        </Link>
        <Link
          href={"/BaseChamber"}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.button
            whileHover={{
              color: "white",
              scale: 1.1,
              transition: {
                duration: 0.1,
              },
            }}
            style={buttonStyle}
          >
            Base Chamber
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
