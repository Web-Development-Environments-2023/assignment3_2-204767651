const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const user_utils = require("./user_utils");
const DButils = require("./DButils");
const e = require("express");



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_data 
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
    return await axios.get(`${api_domain}/random`,{
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
  }



// Extract recipes data from given recipes array 
function extractRecipeDetails(recipe_data)
{
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = recipe_data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            aggregateLikes: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
        }
}




// return 3 random recipes, by using spoonacular API
async function getRandomRecipes() {
    recipee_random_list = [];
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    recipes_arr_info = response.data.recipes;
    recipes_arr_info.map((recipe) => {
                recipee_random_list.push(extractRecipeDetails(recipe));
            });
    return recipee_random_list;
}

  


exports.getRecipeFullDetails = getRecipeFullDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRecipePreview = getRecipePreview;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.SearchRecipes = SearchRecipes;

