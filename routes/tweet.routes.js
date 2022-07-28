const router = require("express").Router();
const tweetController = require("../controllers/tweet.controller");
const multer = require("multer");
const upload = multer();

//tweet db
router.post("/:id", upload.array("pictures"), tweetController.createTweet);
router.get("/", tweetController.getAllTweets);
router.get("/:id", tweetController.getTweet);
router.get("/thread/:id/:type", tweetController.getThread);

//tweet action
router.patch("/fav/:id", tweetController.fav);
router.patch("/unfav/:id", tweetController.unfav);
router.patch("/retweet/:id", tweetController.retweet);
router.patch("/unretweet/:id", tweetController.unRetweet);
router.delete("/:id", tweetController.deleteTweet);

module.exports = router;
