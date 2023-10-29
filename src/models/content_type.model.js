const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

// Define the Field schema
const fieldSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const relationShipSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["oneToMany", "oneToOne", "manyToMany"],
  },
  target_content_type_id: {
    type: Schema.Types.ObjectId,
    ref: "Content_Types",
    required: true,
  },
});

const contentTypeSchema = new Schema({
  //   content_type_id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  slug: String,
  description: String,
  //   media: { ref: { type: Schema.Types.ObjectId, ref: "Media" } },
  relations: [relationShipSchema],
  fields: [fieldSchema], // Embed the Field schema
});
//As name and slug are the most queried index is created
contentTypeSchema.index({ name: -1 });
contentTypeSchema.index({ slug: -1 });

contentTypeSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
contentTypeSchema.statics.uniqueName = async function(name, excludeUserId) {
  const type = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!type;
};

const ContentType = mongoose.model("Content_Types", contentTypeSchema);

module.exports = ContentType;
