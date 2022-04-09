import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, name } = req.body;
  if (username == "" || password == "" || name == "") {
    return res.status(400).send("All fields must be filled");
  }
  try {
    // you can also use async/await
    const data = await pool.query(
      `SELECT * FROM users WHERE username='${username}';`
    );
    if (data.rows.length > 0) {
      return res.status(400).send("User already exists");
    } else {
      await pool.query(
        `INSERT INTO users (id, username, password, name) VALUES (uuid_generate_v4(), '${username}', '${password}', '${name}');`
      );
      return res.status(200).send("Sign up successful");
    }
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
};

export default handler;
