const TweetModel = require("../models/tweet.model");
const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;
const { uploadErrors } = require("../utils/error.utils");
const { uploadFiles } = require("../utils/upload.utils");

//tweetController utils

const filteredTweets = (tweetsArray) => {
  const idArray = [];
  return tweetsArray.filter((elem) => {
    if (
      !idArray.includes(elem.tweet._id.toString()) ||
      elem.type === "retweet"
    ) {
      idArray.push(elem.tweet._id.toString());
      return true;
    }

    return false;
  });
};

const sortTweets = (tweetsArray) => {
  return filteredTweets(tweetsArray).sort((a, b) => {
    if (a.timestamp < b.timestamp) return 1;
    if (a.timestamp > b.timestamp) return -1;
    return 0;
  });
};

//tweet db
module.exports.createTweet = async (req, res) => {
  let files = req.files;
  let filepaths = [];

  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  try {
    filepaths = await uploadFiles(files, req.params.id, "tweet");
  } catch (err) {
    let errors = uploadErrors(err);
    return res.status(201).send(errors);
  }

  try {
    const tweet = await TweetModel.create({
      posterUser: req.params.id,
      message: req.body.message,
      audience: req.body.audience,
      type: req.body.type,
      pictures: req.files !== null ? filepaths : [],
    });
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          tweets: {
            id: tweet._id,
            type: tweet.pictures.length > 0 ? "media" : "tweet",
            timestamp: tweet.createdAt,
          },
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).send(tweet);
  } catch (err) {
    return res.status(201).send(err.message);
  }
};

module.exports.getAllTweets = async (req, res) => {
  const tweets = await TweetModel.find();
  if (tweets) return res.status(200).send(tweets);
  else return res.status(404).send("No tweets found");
};

module.exports.getTweet = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  try {
    const tweet = await TweetModel.findById(req.params.id);
    return res.status(200).send(tweet);
  } catch (err) {
    res.status(404).send(err);
  }
};

module.exports.getThread = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  const handleTweets = async () => {
    const user = await UserModel.findById(req.params.id);
    const timeline = [];
    const userFavs = [];
    const userRetweets = [];

    const getTweets = async (tweetList) => {
      await Promise.all(
        tweetList.map(async ({ id, type, timestamp }) => {
          tweet = await TweetModel.findById(id).populate("posterUser");
          console.log(tweet);
          if (tweet) timeline.push({ tweet, type, timestamp });
          if (tweet.favs.includes(user._id) && !userFavs.includes(tweet._id))
            userFavs.push(tweet._id);
          if (tweet.retweets.includes(user._id)) userRetweets.push(tweet._id);
        })
      );
    };

    const getFollowingUserTweets = async () => {
      await Promise.all(
        user.following.map(async (followingId) => {
          followingUser = await UserModel.findById(followingId);

          await getTweets(followingUser.tweets);
          await getTweets(followingUser.retweets);
          await getTweets(followingUser.favs);
        })
      );
    };

    await getTweets(user.tweets);
    await getTweets(user.retweets);
   /* await getTweets(user.favs); */

    //if(req.params.type === "profil") await getTweets(user.favs);
    if(req.params.type === "home") await getFollowingUserTweets();

    return {
      timeline: sortTweets(timeline),
      userFavs,
      userRetweets,
    };
  };

  try {
    const thread = await handleTweets();
    return res.status(200).send(thread);
  } catch (err) {
    console.log({ err: err.message });
  }
};


//tweet action

module.exports.fav = async (req, res) => {
  const uid = req.body.uid;
  const tweetId = req.params.id;

  if (!ObjectId.isValid(uid))
    return res.status(404).send("Unknown ID : " + uid);

  if (!ObjectId.isValid(tweetId))
    return res.status(404).send("Unknown ID : " + tweetId);

  try {
    const tweet = await TweetModel.findByIdAndUpdate(
      tweetId,
      {
        $addToSet: {
          favs: uid,
        },
      },
      { new: true }
    ).then((docs) => {
      return res.status(200).send(docs);
    });

    await UserModel.findByIdAndUpdate(
      uid,
      {
        $addToSet: {
          favs: { id: tweetId, type: "fav", timestamp: tweet.createdAt },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.unfav = async (req, res) => {
  const uid = req.body.uid;
  const tweetId = req.params.id;

  if (!ObjectId.isValid(uid))
    return res.status(404).send("Unknown ID : " + uid);

  if (!ObjectId.isValid(tweetId))
    return res.status(404).send("Unknown ID : " + tweetId);

  try {
    await TweetModel.findByIdAndUpdate(
      tweetId,
      {
        $pull: {
          favs: uid,
        },
      },
      { new: true }
    ).then((docs) => res.status(200).send(docs));

    await UserModel.findByIdAndUpdate(
      uid,
      {
        $pull: {
          favs: { id: tweetId },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.retweet = async (req, res) => {
  const uid = req.body.uid;
  const tweetId = req.params.id;

  if (!ObjectId.isValid(uid))
    return res.status(404).send("Unknown ID : " + uid);

  if (!ObjectId.isValid(tweetId))
    return res.status(404).send("Unknown ID : " + tweetId);

  try {
    await TweetModel.findByIdAndUpdate(
      tweetId,
      {
        $addToSet: {
          retweets: uid,
        },
      },
      { new: true }
    ).then((docs) => {
      return res.status(200).send(docs);
    });

    const user = await UserModel.findByIdAndUpdate(
      uid,
      {
        $addToSet: {
          retweets: { id: tweetId, type: "retweet", timestamp: Date.now() },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.unRetweet = async (req, res) => {
  const uid = req.body.uid;
  const tweetId = req.params.id;

  if (!ObjectId.isValid(uid))
    return res.status(404).send("Unknown ID : " + uid);

  if (!ObjectId.isValid(tweetId))
    return res.status(404).send("Unknown ID : " + tweetId);

  try {
    await TweetModel.findByIdAndUpdate(
      tweetId,
      {
        $pull: {
          retweets: uid,
        },
      },
      { new: true }
    ).then((docs) => res.status(200).send(docs));

    await UserModel.findByIdAndUpdate(
      uid,
      {
        $pull: {
          retweets: { id: tweetId },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteTweet = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  try {
    await TweetModel.findByIdAndDelete(req.params.id);
    return res.status(200).send("succefuly delete");
  } catch (err) {
    return res.status(400).send(err);
  }
};
