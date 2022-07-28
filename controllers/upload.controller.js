const UserModel = require('../models/user.model');
const fs = require("fs");
const ObjectID = require('mongoose').Types.ObjectId;
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/error.utils");

module.exports.uploadProfil = async (req, res, next) => {
    try {
      if (
        req.file.detectedMimeType !== "image/jpg" &&
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg"
      )
        throw Error("invalid file");
  
      if (req.file.size > 1000000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      res.status(201).json({ errors });
    }
    const fileName = req.body.name + ".jpg";
  
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/profil/${fileName}`
      )
    );
  
    try {
      await UserModel.findByIdAndUpdate(
        req.body.userId,
        { $set : {picture: "./uploads/profil/" + fileName}},
        { new: true, upsert: true, setDefaultsOnInsert: true},
      );
    } catch (err) {
      console.log(err);
    }
  
    res.status(200).send('Upload success')
    next();
  };