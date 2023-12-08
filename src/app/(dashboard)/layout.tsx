import "~/styles/globals.css";

import { Outfit } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ToastContainer } from "~/lib/myToast";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeToggler, Themeprovider, ToggleBtn } from "~/ui";

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
const routes = [
  {
    href: "/dashboard",
    label: "home",
  },
  {
    href: "/dashboard/stores",
    label: "stores",
  },
  {
    href: "/dashboard/orders",
    label: "orders",
  },
  {
    href: "/",
    label: "website",
  },
];
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session || session?.user.role !== "seller") {
    redirect("/register");
  }
  return (
    <html lang="en">
      <body
        className={`h-screen w-full  bg-theme     text-text ${outfit.variable}`}
      >
        <TRPCReactProvider headers={headers()}>
          <Themeprovider>
            <ToastContainer position="top-center" />
            <header className=" fixed  right-0 top-0 z-40 flex h-screen  flex-col  items-center justify-around    bg-theme py-8  ">
              <ToggleBtn
                variant="ghost"
                className=" group peer h-10 w-10 flex-col justify-around  px-0 py-1 data-[checked=true]:bg-primary/40 md:hidden "
              >
                <span className=" h-1 w-9 origin-center rounded bg-revert-theme transition-transform group-data-[checked=true]:translate-y-2  group-data-[checked=true]:rotate-45" />
                <span className=" h-1 w-9 origin-center rounded bg-revert-theme transition-transform group-data-[checked=true]:-translate-y-2  group-data-[checked=true]:-rotate-45" />
              </ToggleBtn>

              <nav className="   flex  w-20 flex-col items-center justify-center  gap-2 transition-[width] duration-500  peer-data-[checked=true]:w-80 md:w-80">
                {routes.map((route) => {
                  return (
                    <Link
                      className="w-full bg-primary/30 px-2 py-4 text-center capitalize hover:bg-primary/70 "
                      href={route.href}
                    >
                      {route.label}
                    </Link>
                  );
                })}
              </nav>
              <ThemeToggler />
            </header>
            {children}
          </Themeprovider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
