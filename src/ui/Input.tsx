import { ComponentProps, FC, forwardRef, useId } from "react";
import { cn } from "../lib/cva";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  errorMSG?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMSG = "", type = "text", ...props }, ref) => {
    const id = useId();

    return (
      <div className="relative flex flex-col justify-start  pb-5">
        <input
          ref={ref}
          id={id}
          className={cn("form-input  ", {
            "border-amber-500": !!errorMSG,
            "h-10 text-black placeholder:text-center placeholder:capitalize": [
              "text",
              "email",
              "password",
              "number",
            ].includes(type),
            "w-full bg-white p-0": type === "color",
          })}
          placeholder={label}
          type={type}
          {...props}
        />
        {errorMSG && (
          <span className="absolute bottom-0  w-full  text-center text-sm text-amber-500">
            {errorMSG}
          </span>
        )}
      </div>
    );
  },
);

export default Input;
