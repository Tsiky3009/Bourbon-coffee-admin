import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return <div>Dashboard</div>;
  } else {
    // redirect to login page
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="p-12 bg-white shadow-md rounded-lg">
          <p className="mb-4">Vous n'êtes pas connécté</p>
          <button
            onClick={() => signIn()}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }
}
