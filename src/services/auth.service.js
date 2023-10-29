const ApiError = require("../utils/ApiError");
const userService = require("./user.service");
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError("Incorrect email or password", 403);
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
