const { Schema, model } = require('mongoose');

const songSchema = new Schema({
  name: String,
  autorsIds: [Schema.Types.ObjectId],
  releasesId: Schema.Types.ObjectId,
  order: Number
});

module.exports = model('Song', songSchema);
