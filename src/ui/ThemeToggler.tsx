"use client";

import { Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { ComponentProps, useState } from "react";
import { cn } from "~/lib/cva";
import { AnimatePresence, m } from "~/lib/framer-motion";
import { Btn, Icons } from "~/ui";
import useIsMounted from "../hooks/useIsMounted";
const toggleValues = [
  {
    name: "light",
    component: <Icons name="sun" className=" h-8 w-8  text-yellow-300 " />,
  },
  {
    name: "dark",
    component: <Icons name="moon" className=" h-8 w-8  text-slate-50" />,
  },
];
const variants: Variants = {
  initial: {
    scale: 0.1,
    rotate: 45,
    x: 0,
  },
  animate: {
    scale: 1,
    rotate: 0,
    x: [0, 16, 0],
  },
  exit: {
    scale: 0.1,
    rotate: -45,
    x: [0, -16, 0],
  },
};
export default function ThemeToggler(props: ComponentProps<"div">) {
  const { setTheme, theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme == "dark");
  const toggleHandler = () => {
    setIsDarkMode((isDark) => {
      setTheme(isDark ? "light" : "dark");
      return !isDark;
    });
  };
  // ? to prevent hydration errors
  const { isMounted } = useIsMounted();
  if (!isMounted) return null;
  return (
    <div
      {...props}
      className={cn(
        "relative flex items-center justify-center p-1",
        props.className,
      )}
    >
      <Btn
        variant="none"
        className={`absolute inset-0 `}
        onClick={toggleHandler}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        {toggleValues.map((opt) => {
          const isActive = theme === opt.name;
          return (
            isActive && (
              <m.div
                key={opt.name}
                variants={variants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                transition={{ duration: 1, ease: "linear" }}
                className={` wi pointer-events-none`}
              >
                {opt.component}
                <span className=" sr-only">{opt.name} mode</span>
              </m.div>
            )
          );
        })}
      </AnimatePresence>
    </div>
  );
}
