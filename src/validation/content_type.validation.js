const Joi = require("joi");
const { objectId } = require("./custom.validation");
const RelationType = {
  oneToMany: "oneToMany",
  oneToOne: "oneToOne",
  manyToMany: "manyToMany",
};
const createContent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    fields: Joi.array().items({
      name: Joi.string().required(),
      type: Joi.string().required(),
    }),
    relations: Joi.array().items({
      name: Joi.string().required(),
      type: Joi.string()
        .required()
        .valid(
          RelationType.manyToMany,
          RelationType.oneToMany,
          RelationType.oneToOne
        ),
      target_content_type_id: Joi.required(),
      // .custom(objectId),
    }),
  }),
};

const updateContent = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      fields: Joi.array().items({
        name: Joi.string().required(),
        type: Joi.string().required(),
      }),
      relations: Joi.array().items({
        name: Joi.string().required(),
        type: Joi.string()
          .required()
          .valid(
            RelationType.manyToMany,
            RelationType.oneToMany,
            RelationType.oneToOne
          ),
        target_content_type_id: Joi.required().custom(objectId),
      }),
    })
    .min(1),
};

const deleteContent = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createContent,
  updateContent,
  deleteContent,
};
