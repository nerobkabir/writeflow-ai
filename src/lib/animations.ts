import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: 16,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.2 } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.15 } 
  }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.22 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    transition: { duration: 0.18 } 
  }
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring", stiffness: 280, damping: 28 } 
  },
  exit: { 
    opacity: 0, 
    x: 24, 
    transition: { duration: 0.2 } 
  }
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring", stiffness: 280, damping: 28 } 
  },
  exit: { 
    opacity: 0, 
    x: -24, 
    transition: { duration: 0.2 } 
  }
};

export const stagger: Variants = {
  animate: { 
    transition: { staggerChildren: 0.08 } 
  }
};

export const staggerFast: Variants = {
  animate: { 
    transition: { staggerChildren: 0.05 } 
  }
};
