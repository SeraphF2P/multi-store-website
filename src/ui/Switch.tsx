import * as RadisSwitch from "@radix-ui/react-switch";
import React, { forwardRef } from "react";
type SwitchProps = RadisSwitch.SwitchProps &
  React.RefAttributes<HTMLButtonElement> & {
    label: string;
  };
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, ...props }, forwardedRef) => {
    return (
      <div className="flex items-center">
        <label
          className="pr-[15px] text-[15px] leading-none text-white"
          htmlFor={label}
        >
          {label}
        </label>
        <RadisSwitch.Root
          className="relative h-[25px] w-[42px] cursor-default rounded-full border-[1px] border-white bg-black shadow-[0_2px_10px] shadow-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-success"
          id={label}
          ref={forwardedRef}
          {...props}
          // style={
          //   {
          //     "-webkit-tap-highlight-color": "rgb(255 ,0 ,0)",
          //   } as CSSProperties
          // }
        >
          <RadisSwitch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-black transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </RadisSwitch.Root>
      </div>
    );
  },
);

export default Switch;
