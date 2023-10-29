const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    filePath: String,
    s3Key: String,
    fileName: String,
    fileType: String,
    size: Number,
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
