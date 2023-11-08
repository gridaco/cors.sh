import React from "react";
import { motion } from "framer-motion";

const LineAnimation = () => {
  // Define the motion variant for the moving light effect
  const motionVariant = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 1.2,
        ease: "linear",
        repeat: Infinity,
      },
    }
  };

  return (
    <motion.div
      variants={motionVariant}
      initial="animate"
      animate="animate"
      style={{
        height: "2px",
        overflow: "hidden",
        backgroundColor: "transparent",
        position: "relative",
        border: "none",
        // The gradient color effect
        backgroundImage: `linear-gradient(
          to right,
          transparent,
          rgba(255, 255, 255, 0.75) 50%,
          transparent 100%
        )`,
        backgroundSize: "200% 100%",
      }}
    />
  );
};

export default LineAnimation;
