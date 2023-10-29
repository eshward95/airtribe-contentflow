const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { userValidation } = require("../validation");
const { userController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route("/:userId")
  .get(auth.protect, validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
