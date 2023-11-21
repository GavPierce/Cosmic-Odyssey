const mongoose = require("mongoose");
const mongooseLeanDefaults = require("mongoose-lean-defaults");

import schema from "./schemas/team";

schema.plugin(mongooseLeanDefaults);

const model = mongoose.model("team", schema);

export default model;
