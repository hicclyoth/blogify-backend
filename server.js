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

//Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
