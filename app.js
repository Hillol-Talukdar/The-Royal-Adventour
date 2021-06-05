const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

fs.readdirSync("./routes").map((rt) =>
    app.use("/api", require("./routes/" + rt))
);

app.all("*", (req, res, next) => {
    next(new appError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
