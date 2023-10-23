import { FC } from "react";
import { NextImage } from "~/ui";
import { getServerAuthSession } from "../../server/auth";
import { redirect } from "next/navigation";
import Regester from "./_components/Regester";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerAuthSession();
  // if (session) {
  //   redirect("/");
  // }
  return (
    <main className=" flex h-screen w-full items-center justify-center bg-red-500">
      <NextImage
        wrapperClassName=" absolute inset-0"
        className=" object-[40%_50%]"
        src="/regester_background.jpg"
        alt="background image"
      />

      <Regester />
    </main>
  );
};

export default page;
