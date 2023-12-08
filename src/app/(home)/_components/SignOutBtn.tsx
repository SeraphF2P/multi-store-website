"use client";
import { FC } from "react";
import { Btn } from "../../../ui";
import { signOut } from "next-auth/react";

interface SignOutBtnProps {}

const SignOutBtn: FC<SignOutBtnProps> = ({}) => {
  return <Btn onClick={() => signOut()}>signout</Btn>;
};

export default SignOutBtn;
