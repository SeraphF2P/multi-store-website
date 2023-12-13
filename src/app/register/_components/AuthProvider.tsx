"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../../lib/myToast";
import { Btn, BtnProps, Icons, Input } from "../../../ui";

interface AuthProviderProps {}
const signupFormSchema = z.object({
  email: z.string().email(),
});

type signupFormType = z.infer<typeof signupFormSchema>;

export const email: FC<AuthProviderProps> = ({}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isLoading },
  } = useForm<signupFormType>({
    resolver: zodResolver(signupFormSchema),
  });
  const submitHandler = async ({ email }: signupFormType) => {
    const res = await signIn("email", { email, redirect: false });
    if (res?.ok) {
      toast({
        message: `an email has been sent to ${email}`,
        type: "success",
      });
    } else {
      toast({ message: "somthing went wrong try again later", type: "error" });
    }
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col  ">
      <Input
        errorMSG={errors.email?.message}
        {...register("email")}
        label="email"
      />
      <Btn disabled={isLoading} type="submit">
        send email verfication
      </Btn>
    </form>
  );
};
export const google: FC<BtnProps> = ({ children, ...props }) => {
  return (
    <Btn {...props} onClick={() => signIn("google", { redirect: false })}>
      <Icons name="google" />
      <span>{children}</span>
    </Btn>
  );
};
