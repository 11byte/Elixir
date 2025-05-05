import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#2f303d",
    color: "white",
    fontSize: "16px",
    textAlign: "center",
    padding: "15px 0",
    width: "100%",
    position: "relative",
    bottom: "0",
    boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
    zIndex: 10,
  };

  const textStyle = {
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.5px",
  };

  return (
    <footer style={footerStyle}>
      <p style={textStyle}>
        © {new Date().getFullYear()} ELIXIR. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
