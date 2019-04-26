const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  type: String,
  pseudonym: String,
  last_name: String,
  first_name: String,
  email: String,
  password: String,
  releasesIds: [Schema.Types.ObjectId],
  songsIds: [Schema.Types.ObjectId],
  addReleasesIds : [Schema.Types.ObjectId],
  addSongsIds: [Schema.Types.ObjectId]
});

module.exports = model('User', userSchema);
