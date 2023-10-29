// const { ContentType } = require("../models");
const { contentypeService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const createContentTypes = catchAsync(async (req, res) => {
  const content = await contentypeService.createContentType(req.body);
  res.status(200).send(content);
});

const getAllContentType = catchAsync(async (req, res) => {
  const content = await contentypeService.queryContent();
  res.status(200).send({ count: content.length, results: content });
});

const getContentType = catchAsync(async (req, res) => {
  const { id } = req.params;
  let content;
  // Check if the provided ID
  //  is in the correct format (MongoDB ObjectID)
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    content = await contentypeService.getContentTypeByNameSlug(id);
  } else {
    content = await contentypeService.getContentTypeById(id);
  }
  if (content) {
    res.status(200).send(content);
  } else {
    throw new ApiError("No data found", 404);
  }
});

const updateContentType = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const content = await contentypeService.updateContentTypeById(id, payload);
  res.status(200).send(content);
});

const deleteContentType = catchAsync(async (req, res) => {
  const { id } = req.params;
  await contentypeService.deleteContentTypeById(id);
  res.status(204).send();
});

module.exports = {
  createContentTypes,
  getAllContentType,
  getContentType,
  updateContentType,
  deleteContentType,
};
