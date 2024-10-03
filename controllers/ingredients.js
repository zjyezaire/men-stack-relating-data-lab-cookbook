const express = require("express");
const router = express.Router();

const Ingredient = require("../models/ingredient.js");

router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render("ingredients/index.ejs", { ingredients });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  try {
    const ingredientCreated = new Ingredient(req.body);
    const ingredientsInDB = await Ingredient.find({});

    const found = ingredientsInDB.find((ingredient) => {
      return (
        ingredient.name.toLowerCase() === ingredientCreated.name.toLowerCase()
      );
    });

    if (found) {
      return res.redirect("/ingredients");
    }

    await ingredientCreated.save();
    res.redirect("/ingredients");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
