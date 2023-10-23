"use client";
import type { FC } from "react";
import { useState } from "react";
import { Btn, Icons } from "~/ui";
import { cn } from "~/lib/cva";
import { signIn } from "next-auth/react";
interface RegesterProps {}

const Regester: FC<RegesterProps> = ({}) => {
  const [activeSection, setActiveSection] = useState("login");
  const isLoginOpen = activeSection == "login";
  const isSignupOpen = activeSection == "signup";
  return (
    <section
      className={cn(
        "flex h-[500px] w-full max-w-xs flex-col overflow-hidden rounded-md shadow-sm backdrop-blur-sm transition-colors duration-500",
        {
          "bg-theme": isLoginOpen,
          "bg-primary": isSignupOpen,
        },
      )}
    >
      <Signup isActive={isSignupOpen} setActiveSection={setActiveSection} />
      <Login isActive={isLoginOpen} setActiveSection={setActiveSection} />
    </section>
  );
};
interface SignupProps {
  setActiveSection: (val: "login" | "signup") => void;
  isActive: boolean;
}

function GoogleSignIn() {
  return (
    <Btn className="  shadow  " variant="none" onClick={() => signIn("google")}>
      <Icons.google />
      <span>sign up with google</span>
    </Btn>
  );
}

const Signup: FC<SignupProps> = ({ setActiveSection, isActive }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-start bg-theme px-2   py-4 transition-[flex_border-radius] duration-500",
        {
          "flex-1 rounded-b-full": isActive,
          "rounded-none": !isActive,
        },
      )}
    >
      <Btn
        variant="ghost"
        className="text-lg capitalize"
        onClick={() => setActiveSection("signup")}
      >
        signup
      </Btn>
      <div
        className={cn(
          "grid max-h-[calc(500px_-_152px)] grid-rows-[0fr]   transition-[grid-template-rows]",
          {
            " h-full grid-rows-[1fr]": isActive,
          },
        )}
      >
        <div className=" overflow-hidden">
          <GoogleSignIn />
        </div>
      </div>
    </div>
  );
};
interface LoginProps {
  setActiveSection: (val: "login" | "signup") => void;
  isActive: boolean;
}

const Login: FC<LoginProps> = ({ setActiveSection, isActive }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center  justify-start  bg-primary px-2  py-4 transition-[flex_border-radius] duration-500",
        {
          "flex-1 rounded-t-full ": isActive,
          "rounded-none": !isActive,
        },
      )}
    >
      <Btn
        variant="ghost"
        className="text-lg capitalize"
        onClick={() => setActiveSection("login")}
      >
        login
      </Btn>
      <div
        className={cn(
          "grid max-h-[calc(500px_-_152px)] grid-rows-[0fr]   transition-[grid-template-rows]",
          {
            " h-full grid-rows-[1fr]": isActive,
          },
        )}
      >
        <div className="  overflow-hidden">
          <GoogleSignIn />
        </div>
      </div>
    </div>
  );
};
export default Regester;
