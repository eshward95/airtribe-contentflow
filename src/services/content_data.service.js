const { contentypeService } = require(".");
const { ContentData, ContentType } = require("../models");

const ApiError = require("../utils/ApiError");
const { getFileById } = require("./content_media.service");

const createContentData = async (contentPayload, id) => {
  let { content_type_id, relations, attributes, media } = contentPayload;
  let content;
  if (!!id) {
    content = await contentypeService.getContentTypeByNameSlug(id);
  } else {
    content = await ContentType.findOne({ _id: content_type_id });
  }

  if (!content) {
    throw new ApiError("Content type not found", 400);
  }
  content_type_id = content._id;

  const attributeMapping = content.get("fields");

  const validateMapping = validateAtrributeMapping(
    attributeMapping,
    attributes,
    media
  );
  if (!validateMapping[0]) {
    throw new ApiError(
      `Invalid attribute mapping "${validateMapping[1]}"`,
      400
    );
  }

  if (media) {
    await getFileById(media);
  }
  const isMediaAllowed = media ? validateMediaMapping(attributeMapping) : false;
  if (media && !isMediaAllowed) {
    throw new ApiError("Media not allowed", 400);
  }

  let updatedContent;
  const newContent = new ContentData({
    content_type_id,
    created_at: new Date(),
    attributes: contentPayload.attributes,
    media: isMediaAllowed ? [media] : [], // Push media if allowed, otherwise an empty array
  });
  updatedContent = newContent;

  if (relations && relations.length > 0) {
    for (const relationData of relations) {
      //if there is a match in the parent type then only add
      const contentTypeParent = await ContentType.findOne({
        name: relationData.parent_type,
        relations: {
          $elemMatch: {
            target_content_type_id: content_type_id,
          },
        },
      });
      if (contentTypeParent) {
        await ContentData.findOneAndUpdate(
          { _id: relationData.target_content_data_id },
          {
            $push: {
              relations: newContent._id,
            },
          },
          { new: true }
        ).exec();
      }
    }
  }
  await newContent.save();
  return updatedContent;
};
const getContentById = async (id) => {
  const contentData = await ContentData.findById(id);
  // .populate({
  //   path: "relations",
  //   populate: {
  //     path: "content_type_id",
  //     select: "name",
  //   },
  // });
  if (!contentData) {
    throw new ApiError("Content type not found", 400);
  }
  return contentData;
};

const getContentByName = async (payload) => {
  //Fetch all details matching the content types
  const contentData = await ContentData.find({
    content_type_id: payload._id,
  }).populate("content_type_id");
  // .explain();
  if (!contentData) {
    throw new ApiError("Content type not found", 400);
  }
  return contentData;
};

/*
  This function is used to get the content data 
  based on name and value of attributes
  Basic Search api of the data
*/
const getContentData = async (payload) => {
  const conditions = [];
  const query = {
    name: Object.entries(payload)[0][0],
    // Example query where 'value' key is present
    value: Object.entries(payload)[0][1], // Uncomment this line for query where 'name' key is present
  };

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]];

      /* Create an array of attribute conditions for each 
      value associated with the key */

      const attributeConditions = values.map((value) => ({
        ["attributes." + key]: { $regex: new RegExp(value) },
      }));
      conditions.push({ $or: attributeConditions });
    }
  }
  //If we have to get only value or key
  // if (query.value) {
  //   if (Array.isArray(query.value)) {

  //     conditions.push({ "attributes.value": { $in: query.value } });
  //   } else {
  //     conditions.push({ "attributes.value": query.value });
  //   }
  // }

  // if (query.name) {
  //   conditions.push({ "attributes.name": query.name });
  // }

  const matchingData = await ContentData.find(
    conditions.length > 0 ? { $or: conditions } : {}
  )
    .populate({
      path: "content_type_id",
      select: "name",
    })
    .populate({ path: "relations", select: "attributes" });
  return matchingData;
};

const getAllContent = async () => {
  return await ContentData.find().populate("media");

  //   .populate({
  //     path: "relations",
  //     populate: {
  //       path: "content_type_id",
  //       select: "name",
  //     },
  //   })
  //   .populate({ path: "content_type_id", select: "name" })
  //   .exec();
};
const getContentDataMatchContentId = async (id, contentTypeId) => {
  const populatedDocuments = await ContentData.findById(id)
    .populate({
      path: "relations",
      match: { content_type_id: contentTypeId },
      select: "content_type_id",
    })
    .exec();
  return populatedDocuments;
};

const updateContentData = async (id, objectId, updateBody) => {
  if (updateBody.content_type_id) {
    throw new ApiError("Content type cannot be edited", 400);
  }

  const contentType = await contentypeService.getContentTypeByNameSlug(id);
  await getContentByName(contentType);
  const contentData = await getContentById(objectId);

  if (!contentType._id.equals(contentData.content_type_id))
    throw new ApiError("Mismatch in Ids", 400);

  const { relations } = updateBody;

  const attributeMapping = contentType.get("fields");
  if (updateBody?.attributes) {
    const validateMapping = validateAtrributeMapping(
      attributeMapping,
      updateBody?.attributes
    );

    if (!validateMapping[0]) {
      throw new ApiError(
        `Invalid attribute mapping "${validateMapping[1]}"`,
        400
      );
    }
  }

  let updatedContent;
  if (updateBody?.media) {
    await getFileById(updateBody?.media);
  }
  const isMediaAllowed = updateBody?.media
    ? validateMediaMapping(attributeMapping)
    : false;
  if (updateBody?.media && !isMediaAllowed) {
    throw new ApiError("Media not allowed", 400);
  }

  if (relations && relations.length > 0) {
    for (const relationData of relations) {
      updatedContent = await processRelationUpdate(
        relationData,
        contentData,
        objectId,
        contentType,
        updateBody
      );
    }
  } else {
    const mergedData = Object.assign(contentData, updateBody);
    await updateContentDataById(contentData._id, mergedData);
    updatedContent = contentData;
  }

  return updatedContent;
};

const processRelationUpdate = async (
  relationData,
  contentData,
  objectId,
  contentType,
  updateBody
) => {
  if (!relationData.parent_type) throw new ApiError("Add parent type", 400);
  //Get the target content Id
  const contentDataChecker = await getContentById(
    relationData.target_content_data_id
  );
  /*
  Check if the parent has a relations with
   the content to be added
  */
  const contentTypeParent = await ContentType.findOne({
    name: contentType.name,
  }).select({
    relations: {
      $elemMatch: {
        target_content_type_id: contentDataChecker.content_type_id,
      },
    },
  });
  //If there is relations present in the types Collection
  if (contentTypeParent?.relations?.length > 0) {
    const updateObject = await buildUpdateObject(
      contentData,
      contentDataChecker,
      contentTypeParent,
      objectId,
      updateBody
    );

    const updatedContent = await updateContentDataById(objectId, updateObject);
    return updatedContent;
  } else {
    throw new ApiError(
      `Error in relation mapping ${contentDataChecker._id}`,
      400
    );
  }
};

const buildUpdateObject = async (
  contentData,
  contentDataChecker,
  contentTypeParent,
  objectId,
  updateBody
) => {
  const updateObject = {};
  //To check if the relation is already added in the content
  const existingMappingIndex = contentData.relations.findIndex((id) =>
    id.equals(contentDataChecker._id)
  );

  if (!updateObject.$set) {
    updateObject.$set = {};
  }
  //Avoiding duplicate entry being added to the relations array
  if (existingMappingIndex !== -1) {
    updateObject.$set[`relations.${existingMappingIndex}`] =
      contentDataChecker._id;
  } else {
    //If the relation is one to one remove the existing entry and map with new
    //relation that is being added
    const oneToOneRelationsExists = await checkOneToOneRelations(
      contentTypeParent,
      objectId,
      contentDataChecker?.content_type_id
    );
    //If there is no one to one relations
    if (!oneToOneRelationsExists) {
      updateObject.$push = {
        relations: contentDataChecker._id,
      };
    } else {
      //We remove the existing entry and update with newly added value
      await removeOneToOneRelation(
        objectId,
        contentDataChecker.content_type_id
      );
      updateObject.$push = {
        relations: contentDataChecker._id,
      };
    }
  }

  for (const field in updateBody) {
    if (field !== "relations") {
      updateObject.$set = updateObject.$set || {};
      updateObject.$set[field] = updateBody[field];
    }
  }

  return updateObject;
};

const checkOneToOneRelations = async (
  contentTypeParent,
  objectId,
  contentTypeId
) => {
  if (contentTypeParent.relations[0].type === "oneToOne") {
    const checkMapping = await getContentDataMatchContentId(
      objectId,
      contentTypeId
    );

    if (checkMapping.relations.length === 1) {
      return true;
    }
  }
  return false;
};

const removeOneToOneRelation = async (objectId, contentTypeId) => {
  const checkMapping = await getContentDataMatchContentId(
    objectId,
    contentTypeId
  );
  if (checkMapping.relations.length > 0)
    await ContentData.findOneAndUpdate(
      { _id: objectId },
      {
        $pull: {
          relations: checkMapping.relations[0]._id,
        },
      },
      { new: true }
    );
};

const updateContentDataById = async (objectId, updateData) => {
  return ContentData.findOneAndUpdate({ _id: objectId }, updateData, {
    new: true,
  }).exec();
};

const deleteContentData = async (slug, id) => {
  const content = await getContentById(id);
  if (!content) throw new ApiError("Data not found", 404);

  if (slug && id) {
    const contentType = await contentypeService.getContentTypeByNameSlug(slug);
    if (contentType._id.equals(content.content_type_id)) {
      await ContentData.deleteMany({ _id: id });
      return await content.remove();
    }
    //This will delete all related content (cascade delete)
  } else if (!slug && id) {
    await ContentData.deleteMany({ relations: id });
    return await content.remove();
  }
};

const validateMediaMapping = (attributeList) => {
  return attributeList.find((attr) => attr.type === "media");
};

const validateAtrributeMapping = (attributeList, dataAttribute) => {
  if (dataAttribute?.length > attributeList?.length)
    throw new ApiError("Error in attribute mapping", 400);
  for (const key of dataAttribute) {
    const attribute = attributeList.find((attr) => attr.name === key.name);
    if (!attribute) {
      return [false, key.name];
    }
  }
  return [true, ""];
};

module.exports = {
  createContentData,
  getContentData,
  getAllContent,
  getContentByName,
  getContentById,
  updateContentData,
  deleteContentData,
};
