const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    posterUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      require: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 280,
    },
    audience: {
      type: String,
      require: true,
      default: "public",
    },
    type:{
      type: String,
      require: true,
      default: "tweet"
    },
    retweetRef:{
      type: mongoose.SchemaTypes.ObjectId,
      ref:"tweet",
    },
    comments: {
      type: [String],
      required: true,
    },
    tweetId: {
      type: String,
    },
    favs: {
      type: [String],
      require: true,
    },
    retweets: {
      type: [String],
      require: true,
    },
    pictures: {
      type: [String],
    },
    gif: {
      type: String,
    },
    sondage: {
      type: {
        questions: [String],
        finalDate: Number,
        result: [Number],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("tweet", TweetSchema);
