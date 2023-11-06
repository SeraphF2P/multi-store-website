"use client";
import { motion } from "framer-motion";
import { Themeprovider } from "~/app/_components";
import { ToastContainer } from "~/lib/myToast";
import { Loading } from "./_ui";

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Themeprovider>
        <ToastContainer position="top-center" />
        {/* <motion.main
          className=" flex h-screen w-full items-center justify-center bg-primary"
          variants={variants}
          initial="hidden"
          animate="enter"
          transition={{ type: "linear" }}
        > */}
        {children}
        {/* </motion.main> */}
      </Themeprovider>
      <Loading name="StaryNightPage" />
    </>
  );
}
