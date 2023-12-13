"use client";
import { Variants, motion } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="   h-screen  w-full flex-col overflow-y-scroll bg-theme/70  pr-20 remove-scroll-bar md:pr-80 "
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="hidden"
      transition={{ type: "linear", duration: 2 }}
    >
      {children}
    </motion.main>
  );
}
