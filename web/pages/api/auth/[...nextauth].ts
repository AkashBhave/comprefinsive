import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import sql from "../../../utils/sql";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials == null) return null;
        try {
          const users =
            await sql`SELECT * FROM users WHERE username=${credentials.username} AND password=${credentials.password};`;
          if (users.length > 0) {
            let user = users[0];
            return {
              id: user.id,
              email: user.username,
              name: user.name,
            };
          } else {
            return null;
          }
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
});
