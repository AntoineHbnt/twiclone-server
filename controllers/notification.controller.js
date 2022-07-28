const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getUserNotifications = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  await UserModel.findById(req.params.id)
    .then((docs) => {
      return res.status(200).send(docs.notifications);
    })
    .catch((err) => {
      return res.status(200).send(err);
    });
};

module.exports.addUserNotification = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        notifications: {
          notifType: req.body.notifType,
          tweetId: req.body.tweetId,
          timestamp: new Date().getTime(),
        },
      },
    },
    { new: true }
  )
    .then((docs) => {
      return res.status(200).send(docs);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
};