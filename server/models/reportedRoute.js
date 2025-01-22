const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportedRouteSchema = new Schema({
  node1: Schema.Types.ObjectId,
  node2: Schema.Types.ObjectId,
  reportedTime: Number,
});

// compile model from schema
module.exports = mongoose.model("reportedRoute", ReportedRouteSchema);
