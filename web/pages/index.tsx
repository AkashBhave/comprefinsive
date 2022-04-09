import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

const HomePage: NextPage = () => {
  const { data: session } = useSession();
  return <p>Hello, world!</p>;
};

export default HomePage;
