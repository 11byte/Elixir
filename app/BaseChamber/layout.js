import React from "react";
import Navbar from "./Navbar";
// Metadata for the layout (could be used with Head or a meta component)
export const metadata = {
  title: "ELIXIR",
  description: "AI platform for replicating users",
};

// Layout component for BaseChamber
const BaseLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default BaseLayout;
