const express = require("express");
const config = require("./config");
const globalErrorHandler = require("./middlewares/Error");
const routes = require("./routes");
const app = express();
const morgan = require("morgan");

// parse json request body
app.use(express.json());
const ApiError = require("./utils/ApiError");

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//Logger middleware
app.use(morgan("dev"));

//ROUTES
app.use("/api", routes);

app.all("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: `Welcome to content flow CMS`,
  });
});

app.use((req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// app.all("*", (req, res, next) => {
//   next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;
