const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  type: String,
  pseudonym: String,
  last_name: String,
  first_name: String,
  email: String,
  password: String,
  releasesIds: [{ type: Schema.Types.ObjectId, ref: 'Release' }],
  songsIds: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  addedSongIds : [{ type: Schema.Types.ObjectId, ref: 'Song' }]
});

module.exports = model('User', userSchema);
