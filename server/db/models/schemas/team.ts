const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  teamCaptain: {
    type: Types.ObjectId,

    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  teamAvatar: {
    type: String,
    default: null,
  },
  members: [
    {
      type: Types.ObjectId,
      required: true,
    },
  ],
  invited: [
    {
      type: Types.ObjectId,
      required: true,
    },
  ],
  isOpen: {
    type: Boolean,
    default: false,
  },
});

export default schema;
