const express = require("express");
const morgan = require("morgan");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

fs.readdirSync("./routes").map((rt) =>
    app.use("/api", require("./routes/" + rt))
);

app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Cannot find ${req.originalUrl} on this server`,
    });
});

module.exports = app;
