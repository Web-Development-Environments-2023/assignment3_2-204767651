var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log(recipe_id);
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

// router.post("/lastSeen", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     const recipeId = req.body.recipeId;
//     await user_utils.markAsSeen(req.session.user_id, recipeId);
//     res.status(200).send("The Recipe was successfully saved as seen");;
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array , user_id);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/myrecipes', async (req, res, next) => {
  try{
    const recipes = await user_utils.getMyRecipes(req.session.user_id);
    res.status(200).send(recipes);
  } catch (error){
    next(error)
  }
});

router.post('/myrecipes', async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const title = req.body.title;
    const cooking_time = req.body.cooking_time;
    const image_url = req.body.image;
    const popularity = req.body.popularity;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const gluten_free = req.body.gluten_free;
    const servings = req.body.servings;
    const instructions = req.body.instructions;
    const ingredients = req.body.ingredients;

    console.log(cooking_time)
    console.log(typeof(cooking_time))
    

    
    await user_utils.addMyRecipe(
      user_id,
      title,
      cooking_time,
      image_url,
      popularity,
      vegan,
      vegetarian,
      gluten_free,
      servings,
      instructions,
      ingredients
    );
    res.status(200).send("The Recipe was successfully saved as a personal recipe");
  } catch (error) {
    next(error);
  }
});





module.exports = router;
