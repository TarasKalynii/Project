const { Schema, model } = require('mongoose');

const releaseSchema = new Schema({
  name: String,
  autorsIds: [Schema.Types.ObjectId],
  songsIds: [Schema.Types.ObjectId]
});

module.exports = model('Release', releaseSchema);
