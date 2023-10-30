"use client";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className=" flex h-screen w-full items-center justify-center bg-primary"
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ type: "linear" }}
    >
      {children}
    </motion.main>
  );
}
