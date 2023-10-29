//The purpose of this pattern is to handle errors thrown
// within asynchronous functions and avoid having to
// use explicit try/catch blocks in each individual route or controller
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

module.exports = catchAsync;
