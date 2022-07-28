
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { registerErrors, loginErrors } = require("../utils/error.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 jours

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

module.exports.register = async (req, res) => {
  const { identifier, password, userAt, userPseudo, dateOfBirth } = req.body;

  try {
    const user = await UserModel.create({
      identifier,
      password,
      userAt,
      userPseudo,
      dateOfBirth
    });
    return res.status(201).json({ user: user._id });
  } catch (err) {
    console.log(err);
    const errors = registerErrors(err);
    return res.status(200).send({ errors });
  }
};

module.exports.login = async (req, res) => {
  const { connectId, password } = req.body;

  try {
    const user = await UserModel.login(connectId, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { maxAge });
    return res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = loginErrors(err);
    return res.status(200).send({ errors });
  }
};

module.exports.changePassword = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const salt = await bcrypt.genSalt();
  let newPassword = await bcrypt.hash(req.body.newPassword, salt);

  const updatedRecord = {
    password: newPassword,
  };

  UserModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  ).select("-password");
};

module.exports.logout = (req, res) => {
  return res
    .cookie("jwt", "", { maxAge: 1 })
    .status(200)
    .send("Disconnected")
    .redirect("/login");
};
