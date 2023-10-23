import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      {session && session.user.id}
    </main>
  );
}
