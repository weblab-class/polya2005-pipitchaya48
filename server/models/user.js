const mongoose = require("mongoose");

const NavSettingsSchema = new mongoose.Schema({
  avoidGrass: { type: Boolean, default: true },
  stayIndoor: { type: Boolean, default: true },
});

const UserSchema = new mongoose.Schema({
  name: String,
  picture: String,
  googleid: String,
  navsettings: NavSettingsSchema,
  savedPlaces: Array,
  history: Array,
});

// compile model from schema
module.exports = [mongoose.model("user", UserSchema), mongoose.model("navsettings", NavSettingsSchema)];
