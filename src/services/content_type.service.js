const { ContentType } = require("../models");
const ApiError = require("../utils/ApiError");
const { getOrSetCache, deleteCacheKey } = require("../utils/redis");

const checkUniqueName = async (name, id) => {
  if (await ContentType.uniqueName(name, id)) {
    return true;
  }
  return false;
};

const createContentType = async (contentPayload) => {
  if (await checkUniqueName(contentPayload.name)) {
    throw new ApiError("Name is unique", 404);
  }
  await deleteCacheKey("content_types");
  return ContentType.create(contentPayload);
};
const queryContent = async () => {
  const data = await getOrSetCache("content_types", async () => {
    const data = await ContentType.find();
    return data;
  });
  return data;
};
const getContentTypeById = async (id) => {
  const data = await getOrSetCache(`content_types:${id}`, async () => {
    const data = await ContentType.findById(id);
    console.log(data);
    return data;
  });
  return data;
};

const updateContentTypeById = async (id, updateBody) => {
  const contentType = await getContentTypeById(id);
  if (await checkUniqueName(updateBody.name, id)) {
    throw new ApiError("Name is unique", 404);
  }
  if (!contentType) throw new ApiError("Type not found", 404);
  if (updateBody?.relations?.length > 0) {
    for (let i = 0; i < updateBody.relations.length; i++) {
      const relation = updateBody.relations[i];
      let relObject = {};
      if (relation.target_content_type_id === id) {
        throw new ApiError("Circular dependency", 400);
      }
      const targetContentType = await ContentType.findOne({
        _id: relation.target_content_type_id,
      });

      if (!targetContentType) {
        throw new ApiError(
          `Content type with _id ${relation.target_content_type_id} does not exist.`,
          404
        );
      }
      relObject.name = targetContentType.slug;
      relObject.target_content_type_id = relation.target_content_type_id;
      relObject.type = relation.type;
      updateBody.relations[i] = relObject;
    }
  }
  Object.assign(contentType, updateBody);
  await ContentType.findByIdAndUpdate(id, { ...contentType, ...updateBody });
  await deleteCacheKey(`content_types:${id}`);
  await deleteCacheKey("content_types");
  return contentType;
};
const deleteContentTypeById = async (id) => {
  await deleteCacheKey(`content_types:${id}`);
  await deleteCacheKey("content_types");
  const contentType = await getContentTypeById(id);
  if (!contentType) throw new ApiError("Type not found", 404);
  return await contentType.remove();
};

const getContentTypeByNameSlug = async (name) => {
  console.log(name);
  const contentType = await ContentType.findOne({
    $or: [
      {
        name,
      },
      {
        slug: name,
      },
    ],
  });
  if (!contentType) throw new ApiError("Type not found", 404);
  return contentType;
};

module.exports = {
  createContentType,
  queryContent,
  getContentTypeById,
  updateContentTypeById,
  deleteContentTypeById,
  getContentTypeByNameSlug,
};
