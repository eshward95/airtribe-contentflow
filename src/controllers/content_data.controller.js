const { contentdataService, contentypeService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const createContentData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const content = await contentdataService.createContentData(req.body, id);
  res.status(200).send(content);
});
const getContentData = catchAsync(async (req, res) => {
  const { id } = req.params;
  let content;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const contentType = await contentypeService.getContentTypeByNameSlug(id);
    if (contentType) {
      content = await contentdataService.getContentByName(contentType);
    } else {
      throw new ApiError("No data found", 404);
    }
  } else {
    content = await contentdataService.getContentById(req.params.id);
  }
  res.status(200).send({ count: content.length, content });
});

const getAllContent = catchAsync(async (req, res) => {
  let content;
  if (Object.keys(req.query).length > 0) {
    content = await contentdataService.getContentData(req.query);
  } else {
    content = await contentdataService.getAllContent();
  }
  res.status(200).send({ count: content.length, content });
});

const updateContentData = catchAsync(async (req, res) => {
  const { slug, objectId } = req.params;
  const content = await contentdataService.updateContentData(
    slug,
    objectId,
    req.body
  );
  res.status(200).send(content);
});
const deleteContentData = catchAsync(async (req, res) => {
  const { slug, objectId } = req.params;
  await contentdataService.deleteContentData(slug, objectId);
  res.status(204).send("Deleted");
});

module.exports = {
  createContentData,
  getContentData,
  getAllContent,
  updateContentData,
  deleteContentData,
};
