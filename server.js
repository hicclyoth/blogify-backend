//Dependencies
require("dotenv").config();
const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

//Middlewares
app.use(cors());
app.use(express.json());

//Posts Route
app.post("/api/post", async (req, res) => {
  const { title, content, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (title,content,user_id) VALUES ($1,$2,$3) RETURNING *",
      [title, content, user_id]
    );
    res.status(201).json({
      message: "Post successfully uploaded to database",
      post: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23503") {
      res.status(400).json({ message: "Author does not exist." });
    }
    res.status(500).json({ message: "Unexpected error occured." });
  }
});

app.get("/api/getPost", async (req, res) => {
  const { post_id } = req.query;

  try {
    const results = await pool.query(
      "SELECT title, content, created_at FROM posts WHERE id = $1",
      [post_id]
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    const { title, content, created_at } = results.rows[0];
    res.json({
      title,
      content,
      created_at,
    });
  } catch (err) {
    console.log(err);
  }
});

//Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
