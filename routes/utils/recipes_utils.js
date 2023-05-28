const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const user_utils = require("./user_utils");


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






async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}



exports.getRecipeDetails = getRecipeDetails;



