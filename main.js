const allTitles = document.querySelectorAll("[drink-id]");
const drinkSection = document.getElementById("drink-wrap");
const drinkIngredient = document.getElementsByClassName("drinkIngredient");
const fetchUrl = "https://the-cocktail-db.p.rapidapi.com/randomselection.php";
const searchInput = document.getElementById("search-input");
const searchOptions = document.getElementById("search-options");
const searchButton = document.getElementById("search-btn");
const COCKTAIL_KEY = "da12acd15cmsh2552fb046e26223p151904jsnef737cab5849";
const COCKTAIL_URL = "the-cocktail-db.p.rapidapi.com";
const RANDOM_SELECTION_URL =
  "https://the-cocktail-db.p.rapidapi.com/randomselection.php";
const form = document.querySelector("#form");

const results = document.querySelector("#results")


const cocktailsStage = [];
const cocltailsSourcesStage = [];
let heroImagePosition = 0;
let heartStage = 0
let favoriteHeartStorage = []

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
    console.log(data)
    setCocktailStage(data.drinks);
  } catch (error) {
    console.log(error);
  }
};

const displayCocktailsName = (cocktail) => {
  const drinkSection_child = document.createElement("div");
  drinkSection_child.id = "top-drinks";
  cocktail.forEach((item) => {
    const div = document.createElement("div");
    div.className = "drink";
    div.textContent = item.strDrink;
    div.setAttribute("drink-id", item.idDrink);
    drinkSection_child.append(div);
  });
  drinkSection.append(drinkSection_child);
};

function displayCocktails(cocktail, parentTag) {
  console.log(parentTag.getAttribute("drink-id"));
  const section = parentTag;

  const div = document.createElement("div");
  div.className = "drink";
  div.id = "toggle-drink";
  div.dataset.value = cocktail.strDrink 

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

  createCloseBtn(div)
  createHeartBtn(div)
}

function handleCocktailClick(e) {
  const toggleDrink = document.querySelector("#toggle-drink")
  const attribute = e.target.getAttribute("drink-id");


  if (e.target.matches("[drink-id]")) {
    if (toggleDrink) {
      toggleDrink.remove();
    }
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
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const query = searchInput.value;

  if (!query) {
    searchOptions.innerHTML = "";
    return;
  }
  if(results){
    results.remove()
  }
  try {
    const response = await fetch(
      `https://the-cocktail-db.p.rapidapi.com/search.php?s=${query}`,
      cocktailSettings
    );
    const data = await response.json();
    await resultsFromInput(data);
    searchInput.value = ""
  } catch (error) {
    console.log(error);
  }
};

// PEXELS API

const pexelsSettings = {
  method: "GET",
  url: 'https://api.pexels.com/videos/videos/5816529',
  headers: {
    Authorization: "cDNlVsBmljR1txSfW6eHvrVgTgCFNcTXE2G5QwdeZHH2fdX1gGNgS33b",
  },
};

const fetchDataPexels = async () => {
  try {
    const response = await fetch(
      "https://api.pexels.com/v1/search?" +
        new URLSearchParams({ query: "cocktail" }),
      pexelsSettings
    );
    const data = await response.json();
    const sources = await data.photos;

    setSourcesStage(sources);
  } catch (error) {
    console.log(error);
  }
};

// GLOBAL FUNCTIONS

const createCloseBtn = (parentTag) => {
  const iconDiv = document.createElement("div");
  iconDiv.id = "icon";
  iconDiv.className = "icon";
  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    span.classList = "icon-arrow"
    iconDiv.append(span);
  }
  parentTag.insertBefore(iconDiv, parentTag.children[0]);
};

async function doOptionsForInput(data) {
  searchOptions.textContent = "";
  await data.drinks.forEach((result) => {
    const optionElement = document.createElement("option");
    optionElement.value = result.strDrink;
    searchOptions.appendChild(optionElement);
  });
}

function setCocktailStage(data) {
  data.forEach((item) => {
    cocktailsStage.push(item);
  });
}

function setCocktailStage(data) {
  data.forEach((item) => {
    cocktailsStage.push(item);
  });
}

function setSourcesStage(data) {
  data.forEach((item) => {
    cocltailsSourcesStage.push(item.src.original);
  });
}

function setIntervalHero() {
const heroImage = document.querySelector("#hero-img");
  setInterval(() => {
    heroImage.src = cocltailsSourcesStage[heroImagePosition];
    heroImagePosition = (heroImagePosition + 1) % cocltailsSourcesStage.length;
  }, 10000);
}

function setLocalStorageDrink(attribute) {
  // Add a class name for heart "red"
  // Add +1 to heart icon displayed in the nav bar
    localStorage.setItem(`${attribute}`, `${attribute}`)
}

function handleHeart(e) {
  // This function is adding but not substracting 
  // We need to create an attribute to avoid adding multimple favorite numbers
  if(e.target.matches("[favoritebtn]")){
    const attribute = e.target.parentNode.dataset.value
    const localStorageDrinks = allStorage()
    const isDrinkInFavorites = localStorageDrinks.includes(`${attribute}`)
    if(!isDrinkInFavorites){
      heartStage += 1
      heartNav.textContent = heartStage + favoriteHeartStorage.length
      setLocalStorageDrink(attribute)
    }
  }
}

function loadFavoriteCounter() {
  const heartNav = document.querySelector("#heart-nav-bar")
  const storageKeys = allStorage()
  storageKeys.forEach(item => {
    favoriteHeartStorage.push(item)
  })
  heartNav.textContent = storageKeys.length
}

function handleFavoriteListOutput(e) {
  const topDrinks = document.querySelector("#top-drinks")
  const favoriteContainer = document.querySelector("#favorite-container")
const results = document.querySelector("#results")

  if(e.target.matches("#favorite-heart")){
    const values = allStorage()
    if(values.length === 0) return
    if(favoriteContainer)return
    if(topDrinks){
      topDrinks.remove()
    }
    if(results){
      results.remove()
    }
    createFavoritesOutputDisplay(values)
    console.log(values)
  }
}

function allStorage() {
  let values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

  while ( i-- ) {
      values.push( localStorage.getItem(keys[i]) );
  }

  return values;
}

function createHeartBtn(parentTag) {
  const heartDiv = document.createElement("div")
  heartDiv.setAttribute("favoriteBtn","")
  heartDiv.className = "favoriteBtn"
  parentTag.append(heartDiv)

  const span = document.createElement("span")
  span.textContent = "Favorite"
  heartDiv.append(span)

  const heartContainer = document.createElement("div")
  heartContainer.className = "heart-container"
  heartDiv.append(heartContainer)

  const heartIcon = document.createElement("i")
  heartIcon.className = "fa-regular fa-heart fa-lg"
  heartContainer.append(heartIcon)
}

function createRemoveFavorite(parentTag) {
  const heartRemoveDiv = document.createElement("div")
  heartRemoveDiv.className = "heart-remove-container"
  heartRemoveDiv.id = "heart-remove-container"
  parentTag.append(heartRemoveDiv)

  const removeHeartIcon = document.createElement("i")
  removeHeartIcon.className = "fa-solid fa-heart-circle-minus fa-xl"
  // removeHeartIcon.className = "remove-heart-icon"
  heartRemoveDiv.append(removeHeartIcon)
}

function createFavoritesOutputDisplay(cocktailNames){

  const parentDiv = document.createElement("div")
  parentDiv.className = "drink-wrap"
  parentDiv.id = "favorite-container"

  // const h3 = document.querySelector("h2")
  // h3.textContent = "Your favorite drinks"
  // drinkSection.insertBefore(h3, parentDiv.children[0])

  cocktailNames.forEach(item => {
    const div = document.createElement("div")
    div.className = "drink"
    div.id = "favorite-drink"
    div.textContent = item
    parentDiv.append(div)
  })


  drinkSection.append(parentDiv)
}


async function handleSingleFavoriteCocktail(e) {
  if(e.target.matches("#favorite-drink")){
    const query = e.target.textContent
    try {
      const response = await fetch(
        `https://the-cocktail-db.p.rapidapi.com/search.php?s=${query}`,
        cocktailSettings
      );
      const data = await response.json();
      console.log(data)
      resultsFromInput(data)
    } catch (error) {
      console.log(error);
    }
  }
}


function handleRemoveFavoriteDrink(e) {
  if(e.target.matches("#heart-remove-container")){

  }
}

function handleLogoHome(e) {
  const app = document.querySelector("#app")
  if(e.target.matches("#logo-home-page")){
    if(app){
      app.remove()
      createApp()
      createHomePage()
    }
  }
}
const getPageData = async () => {
  await fetchData();
  await fetchDataPexels();
  await createHomePage()
  // displayCocktailsName(cocktailsStage, allTitles);
};

getPageData();

async function resultsFromInput(data) {
  const topDrinks = document.querySelector("#top-drinks");
  const favoriteContainer = document.querySelector("#favorite-container")
  const results = document.createElement("div");
  if (topDrinks) {
    topDrinks.remove();
  }
  if(favoriteContainer){
    favoriteContainer.remove()
    drinkSection.dataset.favorite = true
  }
  console.log(data);
  results.className = "results";
  results.id = "results"
  drinkSection.append(results);
  await data.drinks.forEach((result) => {
    let myDrink = result;
    let ingredients = [];
    let count = 1;

    for (let i in myDrink) {
      let ingredient = " ";
      let measure = " ";

      if (i.startsWith("strIngredient") && myDrink[i]) {
        ingredient = myDrink[i];

        if (myDrink[`strMeasure` + count]) {
          measure = myDrink[`strMeasure` + count];
        } else {
          measure = " ";
        }
        count += 1;
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    results.innerHTML = `
    <img src =${myDrink.strDrinkThumb}>
    <h3> ${myDrink.strDrink} </h2>
    <h4> Ingredients: </h4>
    <ul class = "myDrinkIngredients"> </ul>
    <h4> Instructions: </h4>
    <p>${myDrink.strInstructions}</p>
  `;
    let ingredientsCon = document.querySelector(".myDrinkIngredients");
    ingredients.forEach((item) => {
      let listItem = document.createElement("li");
      listItem.innerText = item;
      ingredientsCon.append(listItem);
    });
  });
  createCloseBtn(results);
  createRemoveFavorite(results)
}

// HEADER AND FOOTER 
function createHeader() {

  const app = document.querySelector("#app")
  const header = document.createElement("header")
  header.className = "padding-sides"
  //Nav Section

  const navTag = document.createElement("nav")
  const imgLogo = document.createElement("img")
  imgLogo.src = "/img/Logo.png"
  imgLogo.alt = "Digital-crafts-news"
  imgLogo.id = "logo-home-page"
  header.append(imgLogo)

  const aTopTen = document.createElement("a")
  aTopTen.id = "top-ten-page"
  aTopTen.textContent = "top ten"
  navTag.append(aTopTen)

  const aSearchDrink = document.createElement("a")
  aSearchDrink.id = "search-drink-page"
  aSearchDrink.textContent = "search"
  navTag.append(aSearchDrink)

  const aAboutPage = document.createElement("a")
  aAboutPage.id = "about-page"
  aAboutPage.textContent = "about"
  navTag.append(aAboutPage)

  //Favorite Heart Icon
  const divRightContainer = document.createElement("div")
  divRightContainer.className = "header-right-container"

  const divHeart = document.createElement("div")
  divHeart.className = "heart-container blink"

  const i = document.createElement("i")
  i.className = "fa-regular fa-heart fa-2xl"
  i.id = "favorite-heart"
  divHeart.append(i)

  const divHeartCounter = document.createElement("div")
  divHeartCounter.className = "heart-counter-container"
  divHeart.append(divHeartCounter)
  
  const span = document.createElement("span")
  span.className = "heart-counter"
  span.id = "heart-nav-bar"
  span.textContent = "0"
  divHeartCounter.append(span)
  

  divRightContainer.append(divHeart)
  navTag.append(divRightContainer)
  // Append all to header
  header.append(navTag)
  // header.append(divRightContainer)
  app.insertBefore(header, app.children[0])
}

function createFooter() {
  const app = document.querySelector("#app")
  const footer = document.createElement("footer")
  footer.className = "padding-sides"
  const firstDiv = document.createElement("div")
  const nav = document.createElement("nav")

  const imgLogo = document.createElement("img")
  imgLogo.src = "/img/Logo.png"
  imgLogo.id = "logo-home-page"
  imgLogo.alt = "Digital-crafts-news"
  firstDiv.append(imgLogo)

  const aTopTen = document.createElement("a")
  aTopTen.id = "top-ten-page"
  aTopTen.textContent = "top ten"
  nav.append(aTopTen)

  const aSearchDrink = document.createElement("a")
  aSearchDrink.id = "search-drink-page"
  aSearchDrink.textContent = "search"
  nav.append(aSearchDrink)

  const aAboutPage = document.createElement("a")
  aAboutPage.id = "about-page"
  aAboutPage.textContent = "about"
  nav.append(aAboutPage)

  firstDiv.append(nav)

  const socialDiv = document.createElement("div")
  socialDiv.className = "footer-inner"

  const p = document.createElement("p")
  p.textContent = "Follow us on Socials!"
  socialDiv.append(p)

  const divSocialsChild = document.createElement("div")
  divSocialsChild.className = "socials"
  socialDiv.append(divSocialsChild)

  const imgGitHub = document.createElement("img")
  imgGitHub.src = "./img/github_icon.png"
  imgGitHub.alt = "git hub icon"
  divSocialsChild.append(imgGitHub)
  footer.append(firstDiv)
  footer.append(socialDiv)

  app.insertBefore(footer, app.children[2])
}
// HOME PAGE
async function createHomePage() {
  const app = document.querySelector("#app")
  const main = document.createElement("main")
  main.className = "home-page"
  app.append(main)

  createHeader()
  createFooter()
  heroSectionHomePage(main)
  subTitleHomePage(main)
  await getVideo(main)
  sectionHomePage(main, "vodka")
  sectionHomePage(main, "rum")
  await getSectionCocktail("vodka")
  await getSectionCocktail("rum")
  setIntervalHero()
  loadFavoriteCounter()
}

function heroSectionHomePage(parentTag) {
  const sectionHeroImg = document.createElement("section")
  sectionHeroImg.className = "img-block"
  parentTag.append(sectionHeroImg)

  const img = document.createElement("img")
  img.id = "hero-img"
  img.src = "/img/letsfrolictogether_20140324_0037-1000x650-3.jpg"
  img.alt = "Set of cocktail images"
  sectionHeroImg.append(img)

  const h2Hero = document.createElement("h2")
  h2Hero.textContent = "THE MIXOLOGY MASTER"
  sectionHeroImg.append(h2Hero)
}

function subTitleHomePage(parentTag) {
  const sectionText = document.createElement("section")
  sectionText.className = "sub-title-text padding-sides"
  parentTag.append(sectionText)

  const text = document.createElement("span")
  text.textContent = "A Treasury of Cocktail Recipes and Ingredient Inspiration"
  sectionText.append(text)
}

async function getVideo(parentTag) {
  const section = document.createElement("section")
  section.className = "padding-main"
  parentTag.append(section)

  const video = document.createElement("video")
  video.id = "video-pexel"
  section.append(video)
  try {
    const response = await fetch(pexelsSettings.url, pexelsSettings);
    const data = await response.json();
    video.src = data.video_files[0].link
    video.setAttribute("autoplay","")
    video.setAttribute("controls","")
    video.setAttribute("loop","")
    video.setAttribute("muted","")
    video.className = "main-video"

  } catch (error) {
    console.log(error);
  }
}

function sectionHomePage(parentTag, query) {
  const section = document.createElement("section")
  section.className = "padding-main"
  parentTag.append(section)

  const h2 = document.createElement("h2")
  h2.textContent = `${query}`
  section.append(h2)

  const div = document.createElement("div")
  div.className = "drink-section"
  div.id = `${query}-section`
  section.append(div)
}

async function getSectionCocktail(query) {
  const vodkaSection = document.querySelector("#vodka-section")
  const rumSection = document.querySelector("#rum-section")
  let parentTag = undefined
  query === "vodka" ? parentTag = rumSection : parentTag = vodkaSection
  try {
    const response = await fetch(`https://the-cocktail-db.p.rapidapi.com/search.php?s=${query}`, cocktailSettings);
    const data = await response.json();
    for(let i = 0; i < 6; i++){
      const div = document.createElement("div")
      div.className = "img-container"
      parentTag.append(div)

      const img = document.createElement("img")
      img.src = data.drinks[i].strDrinkThumb
      img.alt = data.drinks[i].strDrink
      div.append(img)

      const span = document.createElement("span")
      span.textContent = data.drinks[i].strDrink
      div.append(span)
    }
  } catch (error) {
    console.log(error);
  }
}

// FAVORITE PAGE
async function createFavoritePage() {
  const app = document.querySelector("#app")
  const main = document.createElement("main")
  main.className = "favorite-page"
  app.append(main)
}

//CREATE APP
function createApp() {
  const body = document.querySelector("body")
  const app = document.createElement("div")
  app.id = "app"
  app.className = "app"
  body.append(app)
}

// searchOptions.addEventListener("input", (e) => {
//   searchInput.value = e.target.value;
// });
// form.addEventListener("submit", handleSubmit);
// searchInput.addEventListener("keyup", handleKeyUp);
document.addEventListener("click", handleCocktailClick);
document.addEventListener("click", handleBtnClose);
document.addEventListener("click",handleHeart);
document.addEventListener("click", handleFavoriteListOutput);
document.addEventListener("click", handleSingleFavoriteCocktail)
document.addEventListener("click", handleRemoveFavoriteDrink)
document.addEventListener("click", handleLogoHome)

function handleBtnClose(e) {
const icon = document.querySelector("#icon");
const results = document.querySelector("#results")
const toggleDrink = document.querySelector("#toggle-drink")
  if(e.target.matches("#icon") || e.target.matches(".icon-arrow") ) {
    icon.classList == "icon" ? icon.classList = "icon open" : icon.classList = "icon" 
    setTimeout(()=> {
      if(drinkSection.dataset.favorite == "true"){
        results.remove()
        createFavoritesOutputDisplay(favoriteHeartStorage)
        drinkSection.dataset.favorite = false
        return
      }
      if(results){
        results.remove()
    displayCocktailsName(cocktailsStage, allTitles);
    return
      }
      if(toggleDrink){
        toggleDrink.remove()

        return
      }

    },500)
  }
}