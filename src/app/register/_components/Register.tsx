"use client";
import { signIn } from "next-auth/react";
import type { FC, FormEvent, PropsWithChildren } from "react";
import { useState } from "react";
import { cn } from "~/lib/cva";
import { toast } from "~/lib/myToast";
import { Btn, Icons, Input } from "~/ui";

interface RegesterProps {}

const Regester: FC<RegesterProps> = ({}) => {
  const [hasAccount, setHasAccount] = useState(true);
  return (
    <section
      className={cn(
        "flex h-[500px] w-full  max-w-xs flex-col overflow-hidden rounded-md border-2 border-white shadow-sm backdrop-blur-sm transition-colors duration-500 ",
        {
          "bg-theme": hasAccount,
          "bg-primary": !hasAccount,
        },
      )}
    >
      <Signup isActive={!hasAccount} setHasAccount={setHasAccount} />
      <Login isActive={hasAccount} setHasAccount={setHasAccount} />
    </section>
  );
};
interface SignupProps {
  setHasAccount: (val: boolean) => void;
  isActive: boolean;
}

function GoogleSignIn({ children }: PropsWithChildren) {
  return (
    <Btn variant="ghost" onClick={() => signIn("google")}>
      <Icons.google />
      <span>{children}</span>
    </Btn>
  );
}

const Signup: FC<SignupProps> = ({ setHasAccount, isActive }) => {
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email");
    const res = await signIn("email", { email, redirect: false });
    if (res?.ok) {
      toast({ message: `an email has been sent to ${email}`, type: "success" });
    } else {
      toast({ message: "somthing went wrong try again later", type: "error" });
    }
  };
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-start bg-theme transition-[flex_border-radius] duration-500",
        {
          "flex-1 rounded-b-full ": isActive,
          "rounded-none": !isActive,
        },
      )}
    >
      <div className="p-4">
        <Btn
          variant="ghost"
          className="text-lg capitalize"
          onClick={() => setHasAccount(false)}
        >
          signup
        </Btn>
      </div>
      <div
        className={cn(
          "grid max-h-[calc(500px_-_152px)] grid-rows-[0fr]   transition-[grid-template-rows] duration-500",
          {
            " h-full grid-rows-[1fr] ": isActive,
          },
        )}
      >
        <div className=" overflow-hidden  ">
          <form
            onSubmit={submitHandler}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Input name="email" label="email" />
            <Btn type="submit">send email verfication</Btn>
            <span className="w-full text-center">or</span>
            <GoogleSignIn>sign up with google</GoogleSignIn>
          </form>
        </div>
      </div>
    </div>
  );
};
interface LoginProps {
  setHasAccount: (val: boolean) => void;
  isActive: boolean;
}

const Login: FC<LoginProps> = ({ setHasAccount, isActive }) => {
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email");
    if (email == null) return;

    const res = await signIn("email", { email });
    if (res?.ok == false) return;
  };
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center  justify-start  bg-primary  transition-[flex_border-radius] duration-500",
        {
          "flex-1 rounded-t-full ": isActive,
          "rounded-none": !isActive,
        },
      )}
    >
      <div className="p-4">
        <Btn
          variant="ghost"
          className="text-lg capitalize"
          onClick={() => setHasAccount(true)}
        >
          login
        </Btn>
      </div>
      <div
        className={cn(
          "grid max-h-[calc(500px_-_152px)] grid-rows-[0fr]   transition-[grid-template-rows] duration-500",
          {
            " h-full grid-rows-[1fr]": isActive,
          },
        )}
      >
        <div className=" overflow-hidden  ">
          <form
            onSubmit={submitHandler}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Input required name="email" label="email" />
            <Btn type="submit">send email verfication</Btn>
            <span className="w-full text-center">or</span>
            <GoogleSignIn>log in with google</GoogleSignIn>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Regester;
