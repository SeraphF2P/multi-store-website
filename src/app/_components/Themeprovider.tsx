"use client";
import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";

const Themeprovider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

export default Themeprovider;