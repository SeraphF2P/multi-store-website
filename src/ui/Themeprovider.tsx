"use client";
import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";
import useIsMounted from "../hooks/useIsMounted";

const Themeprovider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isMounted } = useIsMounted();
  if (!isMounted) return null;
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
};

export default Themeprovider;
