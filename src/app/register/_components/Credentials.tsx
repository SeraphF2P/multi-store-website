"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "~/lib/myToast";
import { debounce } from "~/lib/performance";
import * as ZOD from "~/lib/zodValidators";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { Btn, Input } from "~/ui";
interface CredentialsProps {}
type CredentialsFormType = RouterInputs["authantication"]["signup"];
export const signUp: FC<CredentialsProps> = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isLoading },
    reset,
    getValues,
  } = useForm<CredentialsFormType>({
    resolver: zodResolver(ZOD.auth.signup),
  });
  const { mutate: signup } = api.authantication.signup.useMutation({
    onSuccess: () => {
      const values = getValues();
      signIn("credentials", values);
      reset();
    },
  });

  const { mutate: vlidateUsername, data: usernameNotAvailable } =
    api.authantication.usernameNotAvailable.useMutation();

  const checkIfUsernameIsAvailable = debounce((username) => {
    const u = username as string;
    if (u.length < 3) return;
    vlidateUsername({ username: u });
  }, 400);
  return (
    <form
      className=" flex flex-col "
      onSubmit={handleSubmit((values) => signup(values))}
    >
      <Input
        errorMSG={
          errors.username
            ? errors.username.message
            : usernameNotAvailable
            ? "Username is already exist"
            : ""
        }
        label="userName"
        {...register("username", {
          onChange: (e) => checkIfUsernameIsAvailable(e.target.value),
        })}
        type="text"
      />

      <Input
        errorMSG={errors.password?.message}
        label="password"
        {...register("password")}
        type="password"
      />
      <Input
        errorMSG={errors.password_confirmation?.message}
        label="confirm password"
        {...register("password_confirmation")}
        type="password"
      />
      <Btn disabled={isLoading} type="submit">
        submit
      </Btn>
    </form>
  );
};
export const login: FC<CredentialsProps> = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isLoading },
  } = useForm<CredentialsFormType>({
    resolver: zodResolver(
      z.object({
        username: ZOD.username,
        password: ZOD.password,
      }),
    ),
  });
  const submitHandler = async (values: CredentialsFormType) => {
    const res = await signIn("credentials", { redirect: false, ...values });
    console.log(res);
    if (res?.ok) {
      router.push("/");
    }
    if (res?.ok === false)
      return toast({
        type: "error",
        message: res?.error || "something went wrong",
      });
  };
  return (
    <form
      className="flex flex-col gap-1 "
      onSubmit={handleSubmit(submitHandler)}
    >
      <Input
        errorMSG={errors.username?.message}
        label="user name"
        {...register("username")}
        type="text"
      />
      <Input
        errorMSG={errors.password?.message}
        label="password"
        {...register("password")}
        type="password"
      />
      <Btn type="submit">submit</Btn>
    </form>
  );
};
