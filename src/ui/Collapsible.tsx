"use client";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ReactNode } from "react";
import Btn from "./Btn";
type CollapsapleTable = { children: ReactNode; text: string };
export default function CollapsibleRoot({ children, text }: CollapsapleTable) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <Btn className=" mx-auto" variant="ghost">
          {text}
        </Btn>
      </Collapsible.Trigger>
      <Collapsible.Content asChild>
        <div className="  overflow-hidden data-[state='closed']:animate-slideUp data-[state='open']:animate-slideDown">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
