import * as Tooltip from "@radix-ui/react-tooltip";
import { FC, ReactNode } from "react";
type TooltipComponentProps = {
  children: ReactNode;
  hiddenContent: ReactNode;
};
const Index: FC<TooltipComponentProps> = ({ children, hiddenContent }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content asChild sideOffset={5}>
            <div className="  z-50 rounded border-2 border-revert-theme bg-theme p-1 opacity-0 transition-opacity duration-300 data-[state='delayed-open']:animate-fadein">
              {hiddenContent}
              <Tooltip.Arrow asChild>
                <span className=" h-4  w-4 -translate-y-[calc(50%_+_2px)]   rotate-45 border-2 border-revert-theme bg-theme [clip-path:polygon(100%_0%,100%_100%,0%_100%,100%_0%)] " />
              </Tooltip.Arrow>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default Index;
