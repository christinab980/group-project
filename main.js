const allTitles = document.querySelectorAll("[drink-id]");
const drinkSection = document.getElementById("drink-wrap");
const drinkIngredient = document.getElementsByClassName("drinkIngredient");
const fetchUrl = "https://the-cocktail-db.p.rapidapi.com/randomselection.php";
const results = document.getElementById("results");
const searchInput = document.getElementById("search-input");
const searchOptions = document.getElementById("search-options");
const searchButton = document.getElementById("search-btn");

const COCKTAIL_KEY = "da12acd15cmsh2552fb046e26223p151904jsnef737cab5849";
const COCKTAIL_URL = "the-cocktail-db.p.rapidapi.com";
const RANDOM_SELECTION_URL =
  "https://the-cocktail-db.p.rapidapi.com/randomselection.php";

const cocktailsStage = [];

const cocktailSettings = {
  url: RANDOM_SELECTION_URL,
  method: "GET",
  headers: {
    "X-RapidAPI-Key": COCKTAIL_KEY,
    "X-RapidAPI-Host": COCKTAIL_URL,
  },
};

const fetchData = async () => {
  try {
    const response = await fetch(cocktailSettings.url, cocktailSettings);
    const data = await response.json();
    setCocktailStage(data.drinks);
  } catch (error) {
    console.log(error);
  }
};

const displayCocktailsName = (cocktail) => {
  cocktail.forEach((item) => {
    const div = document.createElement("div");
    div.className = "drink";
    div.textContent = item.strDrink;
    div.setAttribute("drink-id", item.idDrink);
    drinkSection.append(div);
  });
};

function displayCocktails(cocktail, parentTag) {
  console.log(parentTag.getAttribute("drink-id"));
  const section = parentTag;

  const div = document.createElement("div");
  div.className = "drink";
  div.id = "toggle-drink";

  const img = document.createElement("img");
  img.src = cocktail.strDrinkThumb;
  div.append(img);

  const div2 = document.createElement("div");
  div2.className = "drinkIngredient";
  const divIngridient = document.createElement("div");
  const divMeasure = document.createElement("div");
  divMeasure.className = "measure-container";
  divIngridient.className = "ingridients-container";

  cocktail.ingredients.forEach((item) => {
    const measure = document.createElement("div");
    measure.textContent = item;
    divMeasure.append(measure);
    div2.append(divMeasure);
  });

  cocktail.measures.forEach((item) => {
    const ingredient = document.createElement("div");
    ingredient.textContent = item;
    divIngridient.append(ingredient);
    div2.append(divIngridient);
  });

  div.append(div2);
  const div3 = document.createElement("div");
  div3.className = "drinkInstructions";
  const instructions = cocktail.strInstructions;
  div3.append(instructions);
  div.append(div3);
  section.append(div);
}

function handleCocktailClick(e) {
  const toggleDrink = document.querySelector("#toggle-drink");

  if (e.target.matches("[drink-id]")) {
    if (toggleDrink) {
      toggleDrink.remove();
    }
    const attribute = e.target.getAttribute("drink-id");
    // Wipe out the left hand side dom
    // Get the correct cocktail from cocktailsStage - Done
    const targetedCocktail = getClickedCocktaild(attribute);
    const targetedCocktail_tag = e.target;
    displayCocktails(targetedCocktail, targetedCocktail_tag);
    console.log(targetedCocktail);
    // Render cocktail on the DOM
  }
}

const getClickedCocktaild = (id) => {
  if (!id) return;
  if (id) {
    const cleanKeyCocktail = getCleanDataFromSingleId(id, cocktailsStage);
    return cleanKeyCocktail;
  }
};

const getCleanDataFromSingleId = (id, stage) => {
  const cocktail = stage.find((item) => item.idDrink === id);
  if (!cocktail) return;
  if (cocktail) {
    const {
      idDrink,
      strAlcoholic,
      strCategory,
      strDrink,
      strDrinkThumb,
      strInstructions,
      ingredients = [],
      measures = [],
    } = cocktail;
    console.log(cocktail);
    for (const key in cocktail) {
      if (key.startsWith("strIngredient") && cocktail[key]) {
        ingredients.push(cocktail[key]);
      }
      if (key.startsWith("strMeasure") && cocktail[key]) {
        measures.push(cocktail[key]);
      }
    }
    return (cleanCocktail = {
      idDrink,
      strAlcoholic,
      strCategory,
      strDrink,
      strDrinkThumb,
      strInstructions,
      ingredients,
      measures,
    });
  }
};
// INPUT SECTION

const handleKeyUp = async (e) => {
  const query = e.target.value.trim();

  if (!query) {
    searchOptions.innerHTML = "";
    return;
  }
  try {
    const response = await fetch(
      `https://the-cocktail-db.p.rapidapi.com/search.php?s=${query}`,
      cocktailSettings
    );
    const data = await response.json();
    await doOptionsForInput(data);
    await resultsFromInput(data);

  } catch (error) {
    console.log(error);
  }
};

// GLOBAL FUNCTIONS

async function doOptionsForInput(data) {
  // console.log(data);
  searchOptions.textContent = "";
  await data.drinks.forEach((result) => {
    const optionElement = document.createElement("option");
    optionElement.value = result.strDrink;
    searchOptions.appendChild(optionElement);
  });
}

async function resultsFromInput(data) {
  await data.drinks.forEach((result) => {
    let myDrink = result;
    // console.log(myDrink.strDrink);
    // console.log(myDrink.strDrinkThumb);
    // console.log(myDrink.strInstructions);

    let ingredients = [];
    let count = 1;

    for(let i in myDrink) {
      let ingredient = " ";
      let measure = " ";

      if(i.startsWith("strIngredient") && myDrink[i]) {
        ingredient = myDrink[i];

        if(myDrink[`strMeasure`+ count]) {
          measure = myDrink[`strMeasure`+ count];
        } else {
          measure = " ";
        } 
        count += 1;
        ingredients.push(`${measure} ${ingredient}`)
      }
  }
  console.log(ingredients)
  results.innerHTML = `
    <img src =${myDrink.strDrinkThumb}>
    <h3> ${myDrink.strDrink} </h2>
    <h4> Ingredients: </h4>
    <ul class = "myDrinkIngredients"> </ul>
    <h4> Instructions: </h4>
    <p>${myDrink.strInstructions}</p>
  `;
  let ingredientsCon =document.querySelector(".myDrinkIngredients");
  ingredients.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.innerText = item;
    ingredientsCon.append(listItem);
  })
});
}

// searchButton.addEventListener('click', resultsFromInput)

function setCocktailStage(data) {
  data.forEach((item) => {
    cocktailsStage.push(item);
  });
}

const getPageData = async () => {
  await fetchData();
  //  displayCocktails(cocktailsStage);
  displayCocktailsName(cocktailsStage);
};

getPageData();

searchOptions.addEventListener("input", (e) => {
  searchInput.value = e.target.value;
});

searchInput.addEventListener("keyup", handleKeyUp);
document.addEventListener("click", handleCocktailClick);