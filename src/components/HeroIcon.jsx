import { motion } from "framer-motion";

/**
 * 3D-feel floating icon — spherical with light highlight, depth shadow,
 * slow orbiting halo, and gentle drift on mouse.
 */
export default function HeroIcon({
  emoji,
  size = 110,
  color = "#86EFAC",
  shadow = "rgba(22,101,52,0.35)",
  drift = 12,
  duration = 6,
  delay = 0,
  style,
}) {
  return (
    <motion.div
      aria-hidden
      animate={{
        y: [0, -drift, 0, drift * 0.6, 0],
        rotate: [0, 4, 0, -4, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${color} 35%, ${color}cc 70%, ${color}88 100%)`,
        boxShadow: `
          0 30px 60px ${shadow},
          0 12px 24px ${shadow},
          inset 0 -10px 30px rgba(0,0,0,0.18),
          inset 0 8px 18px rgba(255,255,255,0.45)
        `,
        display: "grid",
        placeItems: "center",
        fontSize: size * 0.5,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      <span style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.18))" }}>
        {emoji}
      </span>
      {/* halo */}
      <motion.span
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          border: `1px dashed ${color}55`,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
