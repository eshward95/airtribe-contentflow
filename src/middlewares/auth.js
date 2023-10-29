const { config } = require("../config");
const { User } = require("../models");
const { tokenService } = require("../services");
const AppError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  // 1)getting token and check if its there
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }
    // 2)Validate token
    //   Just because verify is sync we want to promisify it
    const decoded = await tokenService.verifyToken(token, config.secret);
    // if the user has been deleted after login
    // 3)Check if user still exists
    const freshUser = await User.findById(decoded.email._id);
    if (!freshUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }
    //Grant access to protected route
    req.user = freshUser;
    next();
  } catch (err) {
    return next(new AppError(err.message, "401"));
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'marketing']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
