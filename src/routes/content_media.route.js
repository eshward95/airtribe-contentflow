const express = require("express");
const validate = require("../middlewares/validate");
const { contentMediaController } = require("../controllers");
const { contenMediaValidation } = require("../validation");

const router = express.Router();

router
  .route("/")
  .get(contentMediaController.getMedia)
  .post(
    validate(contenMediaValidation.upload),
    contentMediaController.uploadMedia
  );

router
  .route("/:id")
  .all(validate(contenMediaValidation.checkValidMongoId))
  .patch(
    validate(contenMediaValidation.update),
    contentMediaController.updateMedia
  )
  .get(contentMediaController.getMediaById)
  .delete(contentMediaController.deleteMedia);

module.exports = router;
