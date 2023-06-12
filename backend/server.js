const express = require("express");
const cors = require("cors");
const stockRouter = require("./routes/stock");
require("dotenv").config({
  path: "./.env",
});

const app = express();

app.use(express.json({}));
app.use(cors());

app.use("/api", stockRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running in PORT => ${PORT}`);
});
