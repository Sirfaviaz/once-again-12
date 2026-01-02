import { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
}

export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: { 
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeIn' }
  },
}

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    }
  },
}

export const blurToFocus: Variants = {
  hidden: { 
    opacity: 0,
    filter: 'blur(10px)',
    y: 20,
  },
  visible: { 
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { 
      duration: 1,
      ease: 'easeOut',
    }
  },
}

export const slideUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 30,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: 'easeOut',
    }
  },
}

export const slideDown: Variants = {
  hidden: { 
    opacity: 0,
    y: -30,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: 'easeOut',
    }
  },
}

export const zoomOut: Variants = {
  hidden: { 
    opacity: 0,
    scale: 1.2,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: 'easeInOut',
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.6,
      ease: 'easeIn',
    },
  },
}

export const zoomIn: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: 'easeOut',
    }
  },
}

export const typewriter: Variants = {
  hidden: { 
    opacity: 0,
    width: 0,
  },
  visible: { 
    opacity: 1,
    width: 'auto',
    transition: { 
      duration: 1.5,
      ease: 'easeInOut',
    }
  },
}

export const stampDrop: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0,
    rotate: -180,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { 
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration: 0.6,
    }
  },
}

export const lightLeakSweep: Variants = {
  hidden: { 
    x: '-100%',
    opacity: 0,
  },
  visible: { 
    x: '200%',
    opacity: [0, 0.6, 0],
    transition: { 
      duration: 2,
      ease: 'easeInOut',
      times: [0, 0.5, 1],
    }
  },
}

export const ripple: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
  },
}

export const bottomSheet: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export const checkmarkDraw: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 0.8,
        ease: 'easeInOut',
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
}






