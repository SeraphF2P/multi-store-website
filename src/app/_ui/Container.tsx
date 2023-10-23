import { cn } from "~/lib/cva";
import { motion as m, type HTMLMotionProps } from "framer-motion";
import type { ComponentPropsWithRef } from "react";
import { forwardRef, useRef } from "react";

const Container = forwardRef<
  HTMLElement,
  ComponentPropsWithRef<"main"> & HTMLMotionProps<"main">
>(({ children, className, ...props }, forwardRef) => {
  const ref = useRef<HTMLElement>(null);
  if (forwardRef) {
    forwardRef = ref;
  }
  return (
    <m.main
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={cn(
        "font-outfit text-revert-theme remove-scroll-bar shadow-dynamic/40 relative  mx-auto  flex h-screen w-full max-w-[420px] flex-col gap-4 overflow-y-scroll bg-red-500 px-2 py-24 shadow",
        className,
      )}
      {...props}
    >
      {children}
    </m.main>
  );
});
Container.displayName = "Container";
export default Container;
