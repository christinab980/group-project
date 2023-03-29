const drinkSection = document.getElementById("drink-wrap");
const drinkIngredient = document.getElementsByClassName("drinkIngredient");
const fetchUrl = "https://the-cocktail-db.p.rapidapi.com/randomselection.php";
const searchInput = document.getElementById("search-input");
const searchOptions = document.getElementById("search-options");
const COCKTAIL_KEY = "da12acd15cmsh2552fb046e26223p151904jsnef737cab5849";
const COCKTAIL_URL = "the-cocktail-db.p.rapidapi.com";
const RANDOM_SELECTION_URL =
  "https://the-cocktail-db.p.rapidapi.com/randomselection.php";

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
    displayCocktails(data);
  } catch (error) {
    console.log(error);
  }
};


async function displayCocktails(cocktail) {
  const cocktails = cocktail.drinks;

  cocktails.forEach((item) => {
    const section = document.createElement("section");

    const div = document.createElement("div");
    div.className = "drink";
    const drinkName = item.strDrink;
    div.append(drinkName);
    section.append(div);

    const img = document.createElement("img");
    img.src = item.strDrinkThumb;
    div.append(img);
    drinkSection.append(div);

    const div2 = document.createElement("div");
    div2.className = "drinkIngredient";
    const divIngridient = document.createElement("div");
    const divMeasure = document.createElement("div");
    divMeasure.className = "measure-container";
    divIngridient.className = "ingridients-container";

    for (const key in item) {
      if (key.startsWith("strMeasure") && item[key]) {
        const measure = document.createElement("div");
        measure.textContent = item[key];
        divMeasure.append(measure);
        div2.insertBefore(divMeasure, div2.children[0]);
      }
      if (key.startsWith("strIngredient") && item[key]) {
        const ingredient = document.createElement("div");
        ingredient.textContent = item[key];
        divIngridient.append(ingredient);
        div2.append(divIngridient);
      }
    }
    div.append(div2);
    const div3 = document.createElement("div");
    div3.className = "drinkInstructions";
    const instructions = item.strInstructions;
    div3.append(instructions);
    drinkSection.append(div3);
  });
}

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
  } catch (error) {
    console.log(error);
  }
};

async function doOptionsForInput(data) {
  console.log(data);
  searchOptions.textContent = "";
  await data.drinks.forEach((result) => {
    const optionElement = document.createElement("option");
    optionElement.value = result.strDrink;
    searchOptions.appendChild(optionElement);
  });
}

fetchData();
searchOptions.addEventListener("input", (e) => {
  searchInput.value = e.target.value;
});
searchInput.addEventListener("keyup", handleKeyUp);
