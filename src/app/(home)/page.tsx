import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { Header } from "../_components";
import SignOutBtn from "./_components/SignOutBtn";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <Header />
      <Link href={"/dashboard"}>dashboard</Link>" "
      <Link href={"/register"}>register</Link>
      <SignOutBtn />
      <p className="w-full ">
        {session?.user.role || "sd"}
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </p>
    </>
  );
}
