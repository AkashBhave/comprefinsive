import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";

const pool = new Pool();

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials == null) return null;
        try {
          // you can also use async/await
          const res = await pool.query(
            `SELECT * FROM users WHERE username='${credentials.username}' AND password='${credentials.password}';`
          );
          if (res.rows.length > 0) {
            let user = res.rows[0];
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
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
