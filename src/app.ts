import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const db_connection = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@binge-boss-db.41afdlo.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(db_connection);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed: "));
db.once("open", function () {
  console.log("Connected to the database successfully");
});
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World! I'm Binge Boss");
});

app.listen(port, () => {
  return console.log(`Starting Library app - port ${port}`);
});
