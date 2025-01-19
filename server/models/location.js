const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: false },
  latitude: Number,
  longitude: Number,
  hardCoded: { type: Boolean, default: false },
});

// compile model from schema
module.exports = mongoose.model("location", LocationSchema);
