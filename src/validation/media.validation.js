const Joi = require("joi");
const { objectId } = require("./custom.validation");

const update = {
  body: Joi.object()
    .keys({
      fileName: Joi.required(),
    })
    .unknown(false),
};

const upload = Joi.object({
  file: Joi.any().required(),
});

const checkValidMongoId = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = { update, upload, checkValidMongoId };
