const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("DATABASE CONNETED"))
    .catch((err) => console.log("DATABASE CONNECTION ERROR", err));

const app = require("./app");

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App running on port:${port}`));
