const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

fs.readdirSync("./routes").map((rt) =>
    app.use("/api", require("./routes/" + rt))
);

app.all("*", (req, res, next) => {
    next(new appError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
