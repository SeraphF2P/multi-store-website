import { getServerAuthSession } from "~/server/auth";
import { Btn } from "./_ui";
import { Header } from "./_components";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <Header />
      <Link href={"/dashboard"}>dashboard</Link>
      <p className="w-full ">
        {session?.user.role || "sd"}
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </p>
    </>
  );
}
