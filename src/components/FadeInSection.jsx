import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const animations = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  zoom: { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  slideLeft: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  slideRight: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  slideUp: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  slideDown: { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
};

const FadeInSection = ({ children, delay = 0, type = "fade", className, ...props }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.section
      ref={ref}
      initial={animations[type].initial}
      animate={inView ? animations[type].animate : {}}
      transition={{ duration: 2, delay }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default FadeInSection;