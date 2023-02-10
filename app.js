//create express app
const express = require("express");

const app = express();
const path = require("path");
//config environment
require("dotenv").config();

//connect mongodb
require("./config/db")();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

//requires
const globalErrorHandling = require("./middleware/error_middleware");
const ApiError = require("./utils/ApiError");
const auth = require("./routes/authServices");
const userServices = require("./routes/userServices");

//mounting routes
app.use("/auth", auth);
app.use("/user", userServices);

app.all("*", (req, res, next) =>
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400))
);

//global error handling
app.use(globalErrorHandling);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app running success`);
});

//handling exception out express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("server closed ...");
    process.exit(1);
  });
});
