"use client";
import {
  ComponentProps,
  Dispatch,
  ElementRef,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "~/lib/cva";
import { Btn, BtnProps } from "~/ui";

interface SelectProps extends ComponentProps<"input"> {
  open?: boolean;
  defaultSelected?: {
    name: string;
    value: string;
  };
}
type SelectContextProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selected: {
    name: string;
    value: string;
  };
  setSelected: Dispatch<
    SetStateAction<{
      name: string;
      value: string;
    }>
  >;
};
const Context = createContext<SelectContextProps>({
  isOpen: false,
  setIsOpen: () => {},
  selected: {
    name: "",
    value: "",
  },
  setSelected: () => {},
});
const useSelectContext = () => useContext(Context);

export const root = forwardRef<ElementRef<"input">, SelectProps>(
  (
    {
      children,
      className,
      open = false,
      defaultSelected = { name: "", value: "" },
      ...props
    },
    forwardedRef,
  ) => {
    const [isOpen, setIsOpen] = useState(open);
    const [selected, setSelected] = useState(defaultSelected);
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current!, []);

    if (innerRef.current) {
      innerRef.current.value = selected.value;
      console.log(innerRef.current.value);
    }

    return (
      <Context.Provider
        value={{
          isOpen,
          setIsOpen,
          selected,
          setSelected,
        }}
      >
        <div
          data-isopen={isOpen}
          className={cn(" relative w-40  bg-black text-white ", className)}
        >
          {children}
          <input type="hidden" ref={innerRef} {...props} />
        </div>
      </Context.Provider>
    );
  },
);
export const content = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  const { isOpen } = useSelectContext();

  return (
    <>
      {isOpen && (
        <div {...props} className={cn(" flex flex-col", className)}>
          {children}
        </div>
      )}
    </>
  );
};
export const trigger = ({
  className,
  placeholder,
  children,
  ...props
}: BtnProps) => {
  const { setIsOpen, selected } = useSelectContext();
  return (
    <Btn
      className={cn(" w-full", className)}
      {...props}
      onClick={() => setIsOpen((pre) => !pre)}
    >
      {selected.name ? selected.name : placeholder}
    </Btn>
  );
};
export const item = ({
  name,
  value,
  children,
  className,
  ...props
}: ComponentProps<"button"> & { name: string; value: string }) => {
  const { setSelected, selected, setIsOpen } = useSelectContext();
  return (
    <button
      data-active={selected.value === value}
      className={cn(" border-black data-[active=true]:border-2", className)}
      onClick={() => {
        setSelected({ name, value });
        setIsOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
};
export const overlayer = ({ className }: ComponentProps<"section">) => {
  const { isOpen, setIsOpen } = useSelectContext();
  return (
    isOpen && (
      <div
        onClick={() => setIsOpen(false)}
        className={cn(" fixed inset-0 ", className)}
      />
    )
  );
};
