import { redirect } from "next/navigation";
import { FC } from "react";
import { getServerAuthSession } from "../../server/auth";
import Regester from "./_components/Register";
import ThemeToggler from "./_components/ThemeToggler";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/");
  }
  return (
    <>
      {/* <NextImage
        wrapperClassName=" absolute inset-0"
        className=" object-[40%_50%]"
        src="/regester_background.jpg"
        alt="background image"
      /> */}

      <Regester />
      <ThemeToggler className=" absolute right-4 top-4" />
    </>
  );
};

export default page;
