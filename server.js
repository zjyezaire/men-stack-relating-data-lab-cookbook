const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const authController = require("./controllers/auth.js");
const recipesController = require("./controllers/recipes.js");
const ingredientsController = require("./controllers/ingredients.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use("/auth", authController);
app.use(isSignedIn);
app.use("/recipes", recipesController);
app.use("/ingredients", ingredientsController);

mongoose.connection.on("connected", () => {
  console.clear();
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });
});