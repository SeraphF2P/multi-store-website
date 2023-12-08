"use client";
import {
  ComponentProps,
  Dispatch,
  FC,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Btn, BtnProps } from "~/ui";
import { cn } from "../../lib/cva";

interface SelectProps extends HTMLAttributes<HTMLInputElement> {}
type SelectContextProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
};
const Context = createContext<SelectContextProps>({
  isOpen: false,
  setIsOpen: () => {},
  selectedValue: "",
  setSelectedValue: () => {},
});
const useSelectContext = () => useContext(Context);
function Select({ children, className, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <Context.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedValue,
        setSelectedValue,
      }}
    >
      <div
        data-isopen={isOpen}
        className={cn(" w-40  bg-black text-white ", className)}
      >
        {children}
        <input {...props} type="hidden" value={selectedValue} />
      </div>
    </Context.Provider>
  );
}
const Content = ({ children, className, ...props }: ComponentProps<"div">) => {
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
const trigger = ({ className, placeholder, children, ...props }: BtnProps) => {
  const { setIsOpen, selectedValue } = useSelectContext();
  return (
    <Btn
      className={cn(" w-full", className)}
      {...props}
      onClick={() => setIsOpen((pre) => !pre)}
    >
      {selectedValue ? selectedValue : placeholder}
    </Btn>
  );
};
const item = ({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) => {
  const { setSelectedValue, selectedValue, setIsOpen } = useSelectContext();
  return (
    <button
      data-active={selectedValue === value}
      className={cn(" data-[active=true]:bg-emerald-300", className)}
      onClick={() => {
        setSelectedValue(value);
        setIsOpen(false);
      }}
    >
      {children}
    </button>
  );
};
Select.trigger = trigger;
Select.item = item;
Select.Content = Content;

export default Select;
