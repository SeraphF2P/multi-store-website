"use client";
import { signIn } from "next-auth/react";
import { type FC, type PropsWithChildren } from "react";
import { Btn, Icons } from "~/ui";
import * as AuthProvider from "./AuthProvider";
import * as Credentials from "./Credentials";
interface SignupProps {}

export const signup: FC<SignupProps> = () => {
  return (
    <>
      <Credentials.signUp />
      <span className="flex w-full justify-center py-1">or</span>

      <AuthProvider.email />
    </>
  );
};
interface LoginProps {}
export const login: FC<LoginProps> = () => {
  return (
    <>
      <Credentials.login />
      <span className="flex w-full justify-center py-1">or</span>
      <AuthProvider.email />
    </>
  );
};
