const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const firebaseConfig = require("./config/firebase");
const userRoutes = require("./routes/user.routes");
const tweetRoutes = require("./routes/tweet.routes");
const notificationRoutes = require("./routes/notification.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const ngrok = require('ngrok');

require("dotenv").config({ path: "./config/.env" });
require("./config/db");
require("./config/firebase");

global.XMLHttpRequest = require("xhr2");

const app = express();



//Cors policy
const corsOptions = {
  origin: ["http://localhost:3000/", "https://twitclone.vercel.app/","http://localhost:3000", "https://twitclone.vercel.app"],
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

//Allow to access body and cookies in request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/user", userRoutes);
app.use("/api/tweet", tweetRoutes);
app.use("/api/notification", notificationRoutes);

// jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  if (res.locals.user) res.status(200).send(res.locals.user._id);
});

//Server launch
app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});

(async function() {
  const url = await ngrok.connect();
  console.log(url);
})();
