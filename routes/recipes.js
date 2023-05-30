var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/:recipeId/fullDetails", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRecipeFullDetails(req.params.recipeId, user_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});




router.get("/random", async (req, res, next) => {
  try {
    console.log("getRandomRecipes");
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRandomRecipes(user_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});









/**
 * This path returns the information of all recipes that
 * the user saved as favorite
 * (recipes that the user got as recommendation)
  */
router.get("/favorites", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await recipes_utils.getRecipesByUserFavorites(user_id);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
