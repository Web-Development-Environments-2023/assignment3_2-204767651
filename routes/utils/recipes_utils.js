const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const user_utils = require("./user_utils");
const DButils = require("./DButils");
const e = require("express");



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings} = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings
        
    }
}


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 *  */
async function getRecipePreview(recipe_id, user_id){
    let recipe_details = await getRecipeDetails(recipe_id);
    if(user_id){
        recipe_details.isFavorite = await user_utils.getRcipeIndication("favoriterecipes", recipe_id, user_id);
        recipe_details.isWatched = await user_utils.getRcipeIndication("seenrecipes", recipe_id, user_id);
    }
    else{
        recipe_details.isFavorite = false;
        recipe_details.isWatched = false;
    }
    return recipe_details;
}

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * */
async function getRecipesPreview(recipes_ids , user_id){
    let recipes = [];
    for (let i = 0; i < recipes_ids.length; i++) {
        let recipe_details = await getRecipePreview(recipes_ids[i], user_id);
        recipes.push(recipe_details);
    }
    return recipes;
}




async function getRecipeFullDetails(recipes_id, user_id){
    let recipe_details = await getRecipePreview(recipes_id, user_id);
    let recipe_ingredients = await getRecipeIngredients(recipes_id);
    let {ingredients} = recipe_ingredients.data;
    recipe_details.ingredients = ingredients;

    let recipe_instructions = await getRecipeInstructions(recipes_id);
    let {steps} = recipe_instructions.data[0];
    recipe_details.instructions = steps;
    

    return recipe_details;
}





async function getRecipeIngredients(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/ingredientWidget.json`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
}






async function getRecipeInstructions(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function SearchRecipes(query, cuisine, diet, intolerances, numberOfRecipes) {
    return await axios.get(`${api_domain}/search`, {
        params: {
            query: query,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            numberOfRecipes: numberOfRecipes,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function get3RandomRecipes() {
    console.log("get3RandomRecipes");
    const response = await axios.get(`${api_domain}/random`,{
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response.data;
  }
  
  
//   async function getRandomRecipes(user_id){
//     let my_random_list = await get3RandomRecipes();
//     let my_random_list_ids = my_random_list.recipes.map((element) => (element.id)); //extracting the recipe ids into array
//     return getRecipesPreview(my_random_list_ids, user_id);

//   }






  
  async function getRandomRecipes(user_id) {
      let random_pool = await get3RandomRecipes();
    //   let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image && random.image != ""));
    //   if (filterd_random_pool < 3 ) {
    //       return getRandomRecipes();
    //   }
        let filterd_random_pool = random_pool.recipes;
      return getRecipesPreview([filterd_random_pool[0], filterd_random_pool[1], filterd_random_pool[2]], user_id);
  }
  
  












exports.getRecipeFullDetails = getRecipeFullDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.SearchRecipes = SearchRecipes;

