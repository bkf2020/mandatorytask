import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();
  const router = useRouter();
  if (sessionData?.user != null) {
    router.push("/dashboard");
  }

  if (typeof window === 'object') {
    document.body.className = "";
    document.body.classList.add("bg-gradient-to-b", "from-white", "to-blue-100", "text-neutral-800", "dark:from-neutral-900", "dark:to-slate-900", "dark:text-neutral-300");
  }
  return (
    <>
      <Head>
        <title>mandatorytask: home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center text-center min-h-screen">
        <div className="mx-auto w-11/12">
          <h2 className="text-5xl text-sky-600 dark:text-sky-400"><b>Mandatory Task</b></h2>
          <p className="my-3 text-2xl">
            Improve your productivity.
          </p>
          <p className="text-xl">
            Input the tasks you want to finish and the person you want to notify by email
            if you can't finish on time.
          </p>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl dark:text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-blue-900/10 hover:bg-blue-900/20 dark:bg-white/10 px-10 py-3 font-semibold dark:text-white no-underline transition dark:hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
