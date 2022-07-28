const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail, isMobilePhone } = require("validator");

const userSchema = new mongoose.Schema(
  {
    userAt: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      minlength: 6,
      maxlength: 25,
    },
    userPseudo: {
      type: String,
      require: true,
      trim: true,
      minlength: 6,
      maxlength: 25,
    },
    identifier: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    password: {
      type: String,
      require: true,
      maxlength: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/twiclone-339909.appspot.com/o/users%2Fdefault%2Fdefault_profile.png?alt=media&token=c8568032-b59e-444e-bc70-362b237632b3",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 1024,
    },
    localisation: {
      type: String,
      maxlength: 500,
    },
    website: {
      type: String,
      maxlength: 100,
    },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    favs: {
      type: [
        {
          id: String,
          type: { type: String },
          timestamp: Number,
        },
      ],
    },
    retweets: {
      type: [
        {
          id: String,
          type: { type: String },
          timestamp: Number,
        },
      ],
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    tweets: [
      {
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "tweet",
        },
        type: { type: String },
        timestamp: Number,
      },
    ],
    notifications: {
      type: [
        {
          notifType: String,
          tweetId: String,
          timestamps: Number,
        },
      ],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

//Play before save into db (pw hash)
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Login verification
userSchema.statics.login = async function (connectId, password) {
  const user = await (isEmail(connectId) || isMobilePhone(connectId)
    ? this.findOne({ identifier: connectId })
    : this.findOne({ userAt: connectId }));
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else throw Error("incorrrect password");
  } else throw Error("identifiant incorrect");
};

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
