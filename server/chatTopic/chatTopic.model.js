const mongoose = require("mongoose");

const chatTopicSchema = new mongoose.Schema(
  {
    participants: [
      (senderUser = { type: mongoose.Schema.Types.ObjectId, ref: "User" }),
      (receiverUser = { type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    ],

    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chatTopicSchema.index({ senderUser: 1 });
chatTopicSchema.index({ receiverUser: 1 });

module.exports = mongoose.model("ChatTopic", chatTopicSchema);
