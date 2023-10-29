const express = require("express");
const validate = require("../middlewares/validate");
const { contentypeValidation } = require("../validation");
const { contentTypeController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .get(contentTypeController.getAllContentType)
  .post(
    validate(contentypeValidation.createContent),
    contentTypeController.createContentTypes
  );

router
  .route("/:id")
  .get(contentTypeController.getContentType)
  .patch(
    validate(contentypeValidation.updateContent),
    contentTypeController.updateContentType
  )
  .delete(
    validate(contentypeValidation.deleteContent),
    contentTypeController.deleteContentType
  );

module.exports = router;
