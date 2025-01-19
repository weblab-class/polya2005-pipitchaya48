const mongoose = require("mongoose");

const navSettingSchema = new mongoose.Schema({
  avoidGrass: { type: Boolean, default: true },
  stayIndoor: { type: Boolean, default: true },
});

const UserSchema = new mongoose.Schema({
  name: String,
  picture: String,
  googleid: String,
  navsettings: navSettingSchema,
  savedPlaces: Array,
  history: Array,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
