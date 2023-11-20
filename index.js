const express = require("express");
const db = require("./src/config/config");
const app = express();
const bp = require("body-parser");
const transeatsRoute = require("./src/routes/routes");
app.use(bp.json({limit: "50mb"}));
app.use(bp.urlencoded({limit: "50mb", extended: false, parameterLimit:50000}));
app.use("/transeats", transeatsRoute);

app.listen(8080 || process.env.port, () => {
  console.log("App listening on port 8080");
});
