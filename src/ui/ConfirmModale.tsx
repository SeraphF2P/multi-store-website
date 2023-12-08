"use client";
import { FC, ReactNode } from "react";
import { Btn, BtnProps, Modale } from "~/ui";

interface ConfirmModaleProps extends BtnProps {
  title: string;
  content: string;
  onConfirm: () => void;
}

const ConfirmModale: FC<ConfirmModaleProps> = ({
  content,
  onConfirm,
  title,
  ...props
}) => {
  return (
    <Modale>
      <Modale.Btn {...props} />
      <Modale.Content asChild>
        <div className=" mx-2  w-full max-w-xs rounded bg-theme p-4 text-center">
          <h2>{title}</h2>
          <p className=" py-6 leading-6">{content}</p>
          <div className=" flex justify-between">
            <Modale.Close variant="ghost">close</Modale.Close>
            <Modale.Close className=" [--variant:--alert]" onClick={onConfirm}>
              confirm
            </Modale.Close>
          </div>
        </div>
      </Modale.Content>
    </Modale>
  );
};

export default ConfirmModale;
