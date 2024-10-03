const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js");

router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id });
    res.render("recipes/index.ejs", { recipes });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  const ingredients = await Ingredient.find({});
  res.render("recipes/new.ejs", { ingredients });
});

router.post("/", async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      owner: req.session.user._id,
    };

    console.log(recipeData);

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate("ingredients");

    if (recipe.owner.toString() == req.session.user._id) {
      res.render("recipes/show.ejs", { recipe });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (recipe.owner.toString() == req.session.user._id) {
      await Recipe.findByIdAndDelete(req.params.recipeId);
      res.redirect("/recipes");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:recipeId/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (recipe.owner.toString() == req.session.user._id) {
      res.render("recipes/edit.ejs", { recipe });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (recipe.owner.toString() == req.session.user._id) {
      await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
      res.redirect(`/recipes/${req.params.recipeId}`);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
