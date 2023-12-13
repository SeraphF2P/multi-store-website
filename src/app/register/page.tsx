import { redirect } from "next/navigation";
import { FC } from "react";
import { cn } from "~/lib/cva";
import { getServerAuthSession } from "~/server/auth";
import { ThemeToggler } from "~/ui";
import * as Regester from "./_components/Register";
import * as AuthProvider from "./_components/AuthProvider";
import Link from "next/link";

interface pageProps {
  searchParams: { status: "login" | "signup" };
}

const page: FC<pageProps> = async ({ searchParams: { status } }) => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/");
  }
  const hasAccount = status === "login";
  return (
    <main
      className={cn(
        "relative  z-0 flex h-screen items-center  justify-center overflow-hidden  ",
      )}
    >
      <div className=" absolute h-screen w-screen scale-[4] transition-[rotate] duration-1000 dark:[rotate:180deg]   ">
        <div className=" absolute inset-0 bg-theme [clip-path:polygon(calc(50%_-_250px)_0,100%_0,100%_100%,calc(50%_+_250px)_100%,calc(50%_-_250px)_0)] " />
        <div className=" absolute inset-0 bg-primary [clip-path:polygon(0_0,calc(50%_-_250px)_0%,calc(50%_+_250px)_100%,0_100%,0_0)]" />
      </div>
      <section
        className={cn(
          "relative flex h-[520px] w-full max-w-xs flex-col  rounded-sm border-2  border-revert-theme  shadow-sm  transition-colors duration-500 ",
          {
            "bg-theme": hasAccount,
            "bg-primary": !hasAccount,
          },
        )}
      >
        <div
          className={cn(
            "flex w-full flex-col bg-theme px-8 pb-4 text-center transition-[flex_border-radius] duration-500",
            {
              "flex-1 rounded-b-full ": !hasAccount,
              "rounded-none": hasAccount,
            },
          )}
        >
          <Link className="p-4 text-lg capitalize" href={`?status=signup`}>
            signup
          </Link>
          <div
            className={cn(
              "grid max-h-[calc(520px_-_152px)] origin-bottom  grid-rows-[0fr]  transition-[grid-template-rows] duration-500",
              {
                " h-full grid-rows-[1fr] ": !hasAccount,
              },
            )}
          >
            <div className=" overflow-hidden  ">
              <Regester.signup />
            </div>
          </div>
        </div>
        <div
          className={cn(
            "flex w-full flex-col bg-primary   px-8 pt-4  text-center  transition-[flex_border-radius] duration-500",
            {
              "flex-1 rounded-t-full ": hasAccount,
              "rounded-none": !hasAccount,
            },
          )}
        >
          <Link className="p-4 text-lg capitalize" href={`?status=login`}>
            login
          </Link>
          <div
            className={cn(
              "grid max-h-[calc(520px_-_152px)] grid-rows-[0fr]   transition-[grid-template-rows] duration-500",
              {
                " h-full grid-rows-[1fr]": hasAccount,
              },
            )}
          >
            <div className=" overflow-hidden  ">
              <Regester.login />
            </div>
          </div>
        </div>
        <AuthProvider.google className=" absolute left-1/2 top-full  my-4 w-full -translate-x-1/2">
          sign in with google
        </AuthProvider.google>
      </section>
      <ThemeToggler className=" absolute right-4 top-4" />
    </main>
  );
};

export default page;
