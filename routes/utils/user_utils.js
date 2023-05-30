const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsSeen(user_id, recipe_id) {
    await DButils.execQuery(
      `insert into  seenrecipes ('${user_id}','${recipe_id}',NOW())`
    );
  }


async function getRcipeIndication(tablename, recipe_id, user_id){
  let users = [];
  users = await DButils.execQuery(`SELECT user_id FROM ${tablename} WHERE user_id=${user_id} AND recipe_id=${recipe_id}`);
  if (users.length != 0){
      return true;
  }
  return false;
}


exports.getRcipeIndication = getRcipeIndication;
exports.markAsSeen = markAsSeen;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
