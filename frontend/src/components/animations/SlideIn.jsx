import { motion } from 'framer-motion';

export default function SlideIn({ children, direction = 'left', delay = 0 }) {
  const variants = {
    left: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    up: { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  };
  return (
    <motion.div
      initial={variants[direction].initial}
      animate={variants[direction].animate}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}