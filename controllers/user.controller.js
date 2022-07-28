const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  return res.status(200).send(users);
};

module.exports.getUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);
  else {
    UserModel.findById(req.params.id, (err, docs) => {
      if (!err) return res.send(docs);
      else return res.status(404).send("Unknown ID : " + err);
    });
  }
};

module.exports.getUserByUserAt = async (req, res) => {
  UserModel.find({ userAt: req.params.userAt }, (err, docs) => {
    if (!err) return res.send(docs);
    else return res.status(404).send("Unknown userAt : " + err);
  });
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userAt: req.body.userAt,
          userPseudo: req.body.userPseudo,
          bio: req.body.bio,
          localisation: req.body.localisation,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => {
        return res.send(docs);
      })
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return console.log("ID unknown : " + err);
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  try {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: "Succefuly delete" });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToFollow))
    return res.status(404).send("Unknown ID : " + req.body.idToFollow);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(200).send(docs))
      .catch((err) => console.log(err));

    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true }
    ).catch((err) => console.log(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("Unknown ID : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToUnfollow))
    return res.status(404).send("Unknown ID : " + req.body.idToUnfollow);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { following: req.body.idToUnfollow },
      },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(200).send(docs))
      .catch((err) => console.log(err));

    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      {
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true }
    ).catch((err) => console.log(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
