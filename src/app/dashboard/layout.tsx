import "~/styles/globals.css";

import { Outfit } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "../../server/auth";
import { Icons, ToggleBtn } from "../_ui";
import ThemeToggler from "../register/_components/ThemeToggler";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "700"],
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session || session?.user.role != "seller") {
    redirect("/register");
  }
  return (
    <html lang="en">
      <body
        className={`font-outfit bg-theme text-revert-theme ${outfit.variable}`}
      >
        <TRPCReactProvider headers={headers()}>
          <header className=" fixed left-0 top-0 z-40 flex h-screen  flex-col items-center justify-start gap-y-20 bg-theme py-8">
            <ToggleBtn className=" peer h-10 w-10 p-0 aria-checked:bg-red-500 ">
              <Icons name="star" className="h-6 w-6" />
            </ToggleBtn>
            <div className="flex  w-20   flex-col  items-center justify-center gap-2  transition-[width] peer-aria-checked:w-[320px]">
              <Link
                className="w-full  bg-primary/30 px-2 py-4 text-center capitalize hover:bg-primary/70 "
                href={"/dashboard/stores"}
              >
                stores
              </Link>
              <Link
                className="w-full bg-primary/30 px-2 py-4 text-center capitalize hover:bg-primary/70 "
                href={"/dashboard/stores"}
              >
                stores
              </Link>
              <Link
                className="w-full bg-primary/30 px-2 py-4 text-center capitalize hover:bg-primary/70 "
                href={"/dashboard/stores"}
              >
                stores
              </Link>
              <Link
                className="w-full bg-primary/30 px-2 py-4 text-center capitalize hover:bg-primary/70 "
                href={"/dashboard/stores"}
              >
                stores
              </Link>
            </div>
            <ThemeToggler />
          </header>
          <main className="  h-screen w-full  bg-primary pl-20">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}