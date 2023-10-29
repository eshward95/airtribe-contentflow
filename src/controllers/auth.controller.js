const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  //   console.log(req.body);
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateToken(req.body.email);
  res.status(200).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateToken(user);
  res.send({ user, tokens });
});

module.exports = { register, login };
