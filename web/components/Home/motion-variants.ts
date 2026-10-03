"use client";

import { useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";

export const defaultViewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -10% 0px",
} as const;

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.85,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 26,
  mass: 0.9,
};

export const none: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSnappy,
  },
};

export const heroLine: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...springSnappy, delay: 0 },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSnappy,
  },
};

const navMountBase: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 32 },
  },
};

export function useHomeMotion() {
  const reduce = useReducedMotion();
  const r = !!reduce;
  return {
    reduce: r,
    interactive: !r,
    fadeUp: r ? none : fadeUp,
    heroLine: r ? none : heroLine,
    staggerContainer: r ? none : staggerContainer,
    staggerItem: r ? none : staggerItem,
    navMount: r ? none : navMountBase,
    cardHover: r
      ? {}
      : {
          y: -10,
          transition: { type: "spring", stiffness: 400, damping: 22 },
        },
    cardTap: r ? {} : { scale: 0.98 },
    buttonHover: r
      ? {}
      : {
          y: -2,
          scale: 1.03,
          transition: { type: "spring", stiffness: 500, damping: 28 },
        },
    buttonTap: r ? {} : { scale: 0.97 },
    glowHover: r
      ? {}
      : {
          boxShadow:
            "0 0 0 1px rgba(0,255,128,0.35), 0 20px 50px -12px rgba(0,255,128,0.18)",
        },
  };
}
