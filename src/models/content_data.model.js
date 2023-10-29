const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentDataSchema = new Schema(
  {
    content_type_id: { type: Schema.Types.ObjectId, ref: "Content_Types" },
    relations: [this],
    attributes: [
      {
        name: String, // Reference to the Field schema
        value: Schema.Types.Mixed, // Store attribute values with different types
        // You can include other fields specific to attributes
      },
    ],
    media: [{ type: Schema.Types.ObjectId, ref: "Media" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

contentDataSchema.index({ content_type_id: -1 });

contentDataSchema.pre(/^find/, function(next) {
  this.start = Date.now();
  next();
});

contentDataSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const ContentData = mongoose.model("Content_data", contentDataSchema);
module.exports = ContentData;
