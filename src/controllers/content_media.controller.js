const { contentMediaService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const uploadMedia = catchAsync(async (req, res) => {
  const media = await contentMediaService.uploadFile(req, res);
  res
    .status(200)
    .json({ message: "File uploaded successfully", upload: media });
});

const getMedia = catchAsync(async (req, res) => {
  const media = await contentMediaService.getFiles();
  res.status(200).json({ count: media.length, results: media });
});

const getMediaById = catchAsync(async (req, res) => {
  const media = await contentMediaService.getFileById(req.params.id);
  res.status(200).json({ count: media.length, results: media });
});

const updateMedia = catchAsync(async (req, res) => {
  const media = await contentMediaService.updateFile(req.params.id, req.body);
  res.status(200).json({ message: "Updated", upload: media });
});

const deleteMedia = catchAsync(async (req, res) => {
  const media = await contentMediaService.deleteFile(req.params.id);
  res.status(204).json({ message: "Deleted", upload: media });
});

module.exports = {
  uploadMedia,
  getMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
