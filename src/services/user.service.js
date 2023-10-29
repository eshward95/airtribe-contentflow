const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError("Email already taken", 400);
  }
  return User.create(userBody);
};

const queryUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserById = async (id) => {
  return User.findById(id);
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError("Email already taken", 400);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError("User not found", 400);
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
};
