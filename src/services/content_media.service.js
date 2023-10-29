const multer = require("multer");
const uuid = require("uuid");
const multerS3 = require("multer-s3");
const { config } = require("../config");
const path = require("path");
const { ContentMedia } = require("../models");
const AppError = require("../utils/ApiError");
const s3Client = require("../config/awsConfig");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: config.s3.bucket,
    acl: "public",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid.v4()}${ext}`);
    },
  }),
}).single("file");

const uploadFile = (req, res, _) => {
  return new Promise((resolve, reject) => {
    upload(req, res, async function(err) {
      if (err) {
        reject(new AppError(err.message, 500));
      }
      const { file } = req;
      const { fileName } = req.body;
      if (!file) {
        reject(new AppError("No file uploaded", 400));
        return;
      }
      const newUploadObj = {
        filePath: file.location,
        s3Key: file.key,
        fileType: file.mimetype,
        size: file.size,
        fileName: fileName || file.originalname,
      };
      await ContentMedia.create(newUploadObj);
      resolve(newUploadObj);
    });
  });
};

const getFiles = async () => {
  return await ContentMedia.find();
};

const getFileById = async (id) => {
  const media = await ContentMedia.findById(id);
  if (!media) {
    throw new AppError("Media resource not found", 400);
  }
  return media;
};

const updateFile = async (id, payload) => {
  const updateOperation = {
    $set: { fileName: payload.fileName },
  };
  return ContentMedia.findByIdAndUpdate({ _id: id }, updateOperation, {
    new: true,
  }).exec();
};

const deleteFile = async (id) => {
  const response = await ContentMedia.findByIdAndDelete(id);
  if (!response) {
    throw new AppError("Resource not found", 400);
  }
  const s3Param = {
    Bucket: config.s3.bucket,
    Key: response.s3Key,
  };
  const command = new DeleteObjectCommand(s3Param);
  await s3Client.send(command);
  return response;
};

module.exports = { uploadFile, getFiles, getFileById, updateFile, deleteFile };
