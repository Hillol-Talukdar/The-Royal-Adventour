const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// GLOBAL MIDDLEWARES

// Set security HTTP headers
// app.use(helmet());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

//Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP. Please try again in an hour!",
});
app.use("/api", limiter);

// body parser. Reading data from body to req.body
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
    hpp({
        //allows duplicates fields for the array in url
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price",
        ],
    })
);

// Routes
app.use("/", require("./routes/view"));

fs.readdirSync("./routes").map((rt) =>
    app.use("/api", require("./routes/" + rt))
);

// Error handler
app.all("*", (req, res, next) => {
    next(new appError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
