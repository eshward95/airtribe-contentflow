const express = require("express");
const validate = require("../middlewares/validate");
// const { contentypeValidation } = require("../validation");
const { contentDataController } = require("../controllers");
const { contentypeValidation } = require("../validation");

const router = express.Router();

router
  .route("/")
  .get(contentDataController.getAllContent)
  .post(
    // validate(contentypeValidation.createContent),
    contentDataController.createContentData
  );

router
  .route("/:id")
  .post(
    // validate(contentypeValidation.createContent),
    contentDataController.createContentData
  )
  .get(contentDataController.getContentData)
  .delete(contentDataController.deleteContentData);

router
  .route("/:slug/:objectId")
  .delete(contentDataController.deleteContentData)
  .patch(contentDataController.updateContentData);

module.exports = router;
