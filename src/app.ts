import express from "express";
import cors from "cors";
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
