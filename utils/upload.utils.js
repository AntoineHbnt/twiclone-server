const {
  getStorage,
  ref,
  upload,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

module.exports.uploadFiles = async (files, userId, origin) => {
  let paths = [];

  try {
    await Promise.all(
      files.map(async (file) => {
        if (file.mimetype !== "image/jpeg") throw Error("invalid file");
        if (file.size > 500000) throw Error("max size");

        const storageRef = ref(
          storage,
          `users/${userId}/${origin}/` + Date.now() + "_" + file.originalname
        );
        await uploadBytes(storageRef, file.buffer, {
          contentType: "image/jpeg",
        });
        await getDownloadURL(storageRef).then((url) => {
          paths.push(url);
        });
      })
    );
    return paths;
  } catch (err) {
    throw Error(err)
  }
};
