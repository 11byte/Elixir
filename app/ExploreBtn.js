// app/components/ExploreBtn.js
"use client";

import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ExploreBtn = ({ active }) => {
  const { user, isLoaded } = useClerk(); // Get user info from Clerk
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/BaseChamber/page.js");
    } else if (isLoaded) {
      console.log("Please log in");
    }
  }, [isLoaded, user, router]);
  const btnStyle = {
    position: "absolute",
    top: "600px",
    right: "35px",
    fontSize: "25px",
    opacity: active ? 1 : 0.6,
    color: active ? "goldenrod" : "grey",
    boxShadow: isHovered && active ? "0px 0px 150px gold" : "",
    transition: "all 0.5s ease",
    width: isHovered ? "250px" : "150px",
    background: active
      ? "linear-gradient(45deg, rgba(255, 223, 0, 0.2), rgba(255, 223, 0, 0.4), rgba(255, 223, 0, 0.2))"
      : "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",

    border: "2px solid",
    borderColor: active ? "goldenrod" : "silver",
    borderRadius: "50px",
    padding: "10px 20px",
    cursor: active ? "pointer" : "not-allowed",
  };
  return (
    <Link href={active ? "/BaseChamber" : "#"}>
      <button
        style={btnStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && !active ? "Please Log In" : "Explore"}
      </button>
    </Link>
  );
};

export default ExploreBtn;
