import { ComponentProps, FC, forwardRef, useId } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  errorMSG?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMSG, ...props }, ref) => {
    const id = useId();
    return (
      <div className=" relative flex flex-col justify-start">
        <label className=" capitalize" htmlFor={id}>
          {label}
        </label>
        <input
          ref={ref}
          name={label}
          id={id}
          className=" form-input  "
          type="text"
          {...props}
        />
        {errorMSG && (
          <span className=" absolute -bottom-6 right-0 px-1 text-rose-500">
            {errorMSG}
          </span>
        )}
      </div>
    );
  },
);
export default Input;
