const express = require("express");
const db = require("./src/config/config");
const app = express();
const bp = require("body-parser");
const transeatsRoute = require("./src/routes/routes");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/transeats", transeatsRoute);

app.listen(8080 || process.env.port, () => {
  console.log("App listening on port 8080");
});
