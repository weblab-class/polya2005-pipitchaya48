const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  startId: mongoose.Schema.Types.ObjectId,
  endId: mongoose.Schema.Types.ObjectId,
  timesOfQuery: [Date],
});

// compile model from schema
module.exports = mongoose.model("history", HistorySchema);
