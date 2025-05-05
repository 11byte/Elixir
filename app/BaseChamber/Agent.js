import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Use Next.js Link for navigation
import "./Agent.css"; // Assuming you will use a separate CSS file for additional styles

const Agent = ({ name }) => {
  const [isBoxHovered, setIsBoxHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsBoxHovered(true)}
      onMouseLeave={() => setIsBoxHovered(false)}
      className="agent-box"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Background image container with opacity */}
      {isBoxHovered && (
        <div
          className="background-image"
          style={{
            backgroundImage:
              name === "N.O.V.A"
                ? `url('/nova_bg.gif')`
                : `url('/luna_bg.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: name === "N.O.V.A" ? 0.5 : 0.3,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      )}

      <motion.div
        className="agent-name"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h1>{name}</h1>
      </motion.div>

      <motion.p
        className="last-interaction"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <i>last interaction: </i>none
      </motion.p>

      {isBoxHovered && (
        <div className="button-container">
          <Link href={name === "N.O.V.A" ? "#" : "/BaseChamber/Luna"} passHref>
            <button className="peek-button">Peek</button>
          </Link>
          <Link
            href={
              name === "N.O.V.A" ? "/BaseChamber/Nova" : "/BaseChamber/Luna"
            }
            passHref
          >
            <button className="deploy-button">Deploy</button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default Agent;
