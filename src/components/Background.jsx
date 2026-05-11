import { motion, useScroll, useTransform } from "framer-motion";
import { C } from "../theme";

export function HeroBlobs() {
  return (
    <>
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-12%",
          right: "-10%",
          width: 620,
          height: 620,
          maxWidth: "70vw",
          background: `radial-gradient(circle, ${C.bgAlt} 0%, transparent 65%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.12, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-8%",
          width: 540,
          height: 540,
          maxWidth: "60vw",
          background:
            "radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "30%",
          left: "30%",
          width: 360,
          height: 360,
          background:
            "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 65%)",
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}

export function Parallax({ children, speed = 0.3, style }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * -160]);
  return (
    <motion.div style={{ y, ...style }}>
      {children}
    </motion.div>
  );
}
