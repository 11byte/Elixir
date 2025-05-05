"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import Navbar from "./BaseChamber/Navbar";
import InfoPanel from "./InfoPanel";
import Footer from "./Footer";
const Title = dynamic(() => import("./Title"), { ssr: false });

export default function Home() {
  const { scrollYProgress } = useScroll();
  const subHeading = {
    width: "720px",
    height: "auto",
    backgroundColor: "transparent",
    borderRadius: "20px",
    color: "silver",
    marginTop: "320px",
    marginBottom: "100px",
    fontSize: "25px",
  };

  const originalOrder = [
    "Replicate",
    "your",
    "mind ,",
    "Amplify",
    "your",
    "abilities",
  ];

  const [order, setOrder] = useState(originalOrder);
  const [shuffleCount, setShuffleCount] = useState(0);

  useEffect(() => {
    if (shuffleCount < 5) {
      const timeout = setTimeout(() => {
        setOrder(shuffle(originalOrder));
        setShuffleCount(shuffleCount + 1);
      }, 400);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setOrder(originalOrder);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [shuffleCount]);

  return (
    <div>
      <Navbar />
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          originX: 0,
          backgroundColor: "gold",
          zIndex: "100",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          marginLeft: "150px",
        }}
      >
        <Title char={"E"} initPoint={100 + 80} xl={20} />
        <Title char={"L"} initPoint={315 + 80} xl={30} />
        <Title char={"I"} initPoint={535 + 80} xl={40} />
        <Title char={"X"} initPoint={705 + 80} xl={50} />
        <Title char={"I"} initPoint={940 + 80} xl={60} />
        <Title char={"R"} initPoint={1080 + 80} xl={70} />
      </div>

      <center>
        <motion.h3
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "tween",
            ease: "easeOut",
            duration: 1.8,
          }}
          style={subHeading}
        >
          <motion.p
            animate={{ rotate: [720, -360, 360] }}
            transition={{
              times: [0, 0.5, 1],
              type: "tween",
              ease: "easeOut",
              duration: 2,
            }}
            style={{
              fontSize: "50px",
              color: "gold",
              margin: "10px",
              display: "inline-block",
              width: "5px",
            }}
          >
            /
          </motion.p>
          <div style={{ display: "inline-block" }}>
            {order.map((word, index) => (
              <motion.span
                key={index}
                layout
                transition={spring}
                style={{
                  display: "inline-block",
                  padding: "0px",
                  margin: "5px",
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.p
            animate={{ rotate: [720, -360, 360] }}
            transition={{
              times: [0, 0.5, 1],
              type: "tween",
              ease: "easeOut",
              duration: 2,
            }}
            style={{
              fontSize: "50px",
              color: "gold",
              margin: "10px",
              display: "inline-block",
              width: "5px",
            }}
          >
            /
          </motion.p>
        </motion.h3>

        <motion.img
          style={{
            position: "sticky",
          }}
          animate={{
            y: ["0px", "-20px", "0px"],
          }}
          transition={{
            type: "keyframes",
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          src="/favicon.ico"
          alt="Favicon"
          width="50"
          height="50"
        />
      </center>
      <div
        style={{
          margin: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          height: "1900px",
        }}
      >
        <InfoPanel
          img={"/nova.png"}
          name={"N.O.V.A"}
          text={
            "A top notch profession evaluator Agent, which evaluates any profession by interactive Learning"
          }
          posArray={[0, 800, 1000, 1100, 1200, 1300]}
          tp={"10px"}
          rp={""}
          lp={"50px"}
        />
        {/* InfoPanel 2 */}
        <InfoPanel
          img={"/luna.png"}
          name={"L.U.N.A"}
          text={
            "Your AI coach! Tracks your behavior and preferences, helping you make smarter decisions through fun activities and personalized advice."
          }
          posArray={[1100, 1300, 1500, 1700, 2000, 2200]}
          tp={"650px"}
          rp={"50px"}
          lp={""}
        />
        {/* InfoPanel 3 */}
        <InfoPanel
          img={"/replica.png"}
          name={"R.E.P.L.I.C.A"}
          text={
            "Your digital twin! REPLICA learns your style and preferences to create web designs that match your unique taste."
          }
          posArray={[1700, 1900, 2100, 2300, 2500, 2700]}
          tp={"1350px"}
          rp={""}
          lp={"50px"}
        />
      </div>

      <Footer />
    </div>
  );
}

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};
