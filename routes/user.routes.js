const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const uploadController = require("../controllers/upload.controller.js");
const multer = require("multer");
const upload = multer();

//auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.put("/:id", authController.changePassword);

//user db
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.get("/at/:userAt", userController.getUserByUserAt);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

//user action
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

//upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
