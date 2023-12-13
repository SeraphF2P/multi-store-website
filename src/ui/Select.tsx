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
  defaultSelected?: string;
  errorMSG?: string;
}
type SelectContextProps = {
  isOpen: boolean;
  errorMSG?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selected: string;
  placeholder: string;
  selectHandler: ({ name, value }: { name: string; value: string }) => void;
};
const Context = createContext<SelectContextProps>({
  isOpen: false,
  setIsOpen: () => {},
  selected: "",
  selectHandler: () => {},
  errorMSG: "",
  placeholder: "select",
});
const useSelectContext = () => useContext(Context);

export const root = forwardRef<
  ElementRef<"input">,
  SelectProps & {
    onSelectChange: ({ name, value }: { name: string; value: string }) => void;
  }
>(
  (
    {
      children,
      className,
      open = false,
      defaultSelected = "",
      defaultValue,
      errorMSG = "",
      placeholder = "select",
      onSelectChange,
      ...props
    },
    forwardedRef,
  ) => {
    const [isOpen, setIsOpen] = useState(open);
    const [selected, setSelected] = useState(defaultSelected);
    const [triggerPlaceholder, setTriggerPlaceholder] = useState(placeholder);
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current!, []);
    const selectHandler = ({
      name,
      value,
    }: {
      name: string;
      value: string;
    }) => {
      setTriggerPlaceholder(() => name);
      setSelected(() => value);
      if (onSelectChange) {
        onSelectChange({ name, value });
      }
    };
    return (
      <Context.Provider
        value={{
          isOpen,
          setIsOpen,
          placeholder: triggerPlaceholder,
          selected,
          selectHandler,
          errorMSG,
        }}
      >
        <div
          data-isopen={isOpen}
          className={cn(" relative w-40  bg-black text-white ", className)}
        >
          {children}
          <input
            className="sr-only"
            ref={innerRef}
            {...props}
            type="text"
            defaultValue={selected}
            value={selected}
          />
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
export const trigger = ({ className, children, ...props }: BtnProps) => {
  const { setIsOpen, selected, errorMSG, placeholder } = useSelectContext();
  return (
    <div className="relative flex flex-col justify-start pb-5">
      <Btn
        className={cn(" form-select w-full  bg-theme", className)}
        {...props}
        onClick={() => setIsOpen((pre) => !pre)}
      >
        {placeholder}
      </Btn>
      {errorMSG && (
        <span className="absolute bottom-0  w-full  text-center text-sm text-amber-500">
          {errorMSG}
        </span>
      )}
    </div>
  );
};
export const item = ({
  name,
  value,
  children,
  className,
  ...props
}: ComponentProps<"button"> & { name: string; value: string }) => {
  const { selected, setIsOpen, selectHandler } = useSelectContext();
  return (
    <button
      data-active={selected === value}
      className={cn(" border-black data-[active=true]:border-2", className)}
      onClick={() => {
        selectHandler({ name, value });
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
