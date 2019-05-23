const { Schema, model } = require('mongoose');

const songSchema = new Schema({
  name: String,
  autorsIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  releasesId: { type: Schema.Types.ObjectId, ref: 'Release' },
  order: Number
});

module.exports = model('Song', songSchema);
