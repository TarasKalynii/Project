const { Schema, model } = require('mongoose');

const releaseSchema = new Schema({
  name: String,
  autorsIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  songsIds: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
});

module.exports = model('Release', releaseSchema);
