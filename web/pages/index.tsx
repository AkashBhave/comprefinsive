import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

const HomePage: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default HomePage;
