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
  if(e.target.matches("#search-icon-panel")){
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
  // const topDrinks = document.querySelector("#top-drinks");
  // const favoriteContainer = document.querySelector("#favorite-container")
  // if (topDrinks) {
  //   topDrinks.remove();
  // }
  // if(favoriteContainer){
  //   favoriteContainer.remove()
  //   drinkSection.dataset.favorite = true
  // }
  const main = document.querySelector("main")
  const results = document.getElementById("results");
  console.log(data);
 
  main.append(results);
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
  i.className = "fa-regular fa-heart fa-xl"
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

  //Search Input Icon 

  const searchContainer = document.createElement("div")
  searchContainer.className = "search-container"

  const searchIcon = document.createElement("i")
  searchIcon.className = "fa-solid fa-magnifying-glass fa-xl"
  searchIcon.id = "search-icon"
  searchContainer.append(searchIcon)
  navTag.append(searchContainer)

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

// Search function 

async function handleSearchButton(e) {
  if(e.target.matches("#search-icon")) { 
    app.remove()
    createApp()

    const main = document.createElement("main")
    app.append(main)
    
    createHeader()
    createSearchPanel(main)
    await resultsFromInput()
    createFooter()
  }
}
async function doOptionsForInput(data) {
  const searchInput =  document.getElementById("search-input")
  searchInput.textContent = "";
  await data.drinks.forEach((result) => {
    const optionElement = document.createElement("option");
    optionElement.value = result.strDrink;
    search.appendChild(optionElement);
  });
}

function createSearchPanel() {
  const app = document.querySelector("#app")
  const main = document.querySelector("main")
  console.log(main)
  
  const shell = document.createElement("section")
  shell.className = "shell"
  shell.id = "shell"
  main.append(shell)

  const panel = document.createElement("panel")
  panel.className = "search-panel"
  panel.id = "search-panel"
  shell.append(panel)

  const searchSection = document.createElement("section")
  searchSection.className = "search-section-input"
  panel.append(searchSection)

  const searchInput = document.createElement("input")
  searchInput.className = "search-input"
  searchInput.id = "search-input"
  searchInput.setAttribute("placeholder", "search here...")
  searchSection.append(searchInput)

  const searchIcon = document.createElement("i")
  searchIcon.className = "fa-solid fa-magnifying-glass fa-xl"
  searchIcon.id = "search-icon-panel"
  searchSection.append(searchIcon)

  const div = document.createElement("div")
  div.className = "results"
  div.id = "results"
  main.append(div)

  app.append(main)
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
  article(main)
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

function article(parentTag) {
  const sectionArticle = document.createElement("section")
  sectionArticle.className = "article-content"
  parentTag.append(sectionArticle)

  const div = document.createElement("div")
  div.textContent = "You raise a glass at weddings."
  sectionArticle.append(div)

  const div1 = document.createElement("div")
  div1.textContent = "You cheers at a football game."
  sectionArticle.append(div1)

  const div2 = document.createElement("div")
  div2.textContent = "You Cin Cin if you’re in Italy."
  sectionArticle.append(div2)

  const div3 = document.createElement("div")
  div3.textContent = "And say Kanpai if you’re in Japan."
  sectionArticle.append(div3)

  const div4 = document.createElement("div")
  div4.className = "article-content-1"
  div4.textContent = "Around the world human beings celebrate with cocktails – whether it’s a wedding, birthday, happy hour with your co-workers or a simple dinner with family, booze brings us together. A study done by PNAS in 2021 showed that alcohol literally narrows physical distance between strangers meaning cocktails are bringing people together. There are countless articles, season after season, on what the best cocktails for any occasion.  We have songs, food, and locations that we pair with different alcohols. Well, here’s another article to add to the list. "
  sectionArticle.append(div4)

  const div5 = document.createElement("div")
  div5.className = "article-content-1"
  div5.textContent = "This website is a Digital Crafts front-end group project made by John Garcia and Christina Barron. Look around! We are proud of our project and would love if you grabbed a drink and stayed awhile. "
  sectionArticle.append(div5)

  const div6 = document.createElement("div")
  div6.className = "article-content-1"
  div6.textContent = "The question is: Do you have a drink? Or are you looking for a cocktail with a specific spirit? Simply scroll down! Or are you interested our top ten list to start 2023, click the link in the menu. Oh, you’re still reading… that means you’re looking for something specific! Right?! Then click search icon and type in what cocktail you want to drink! Cheers! "
  sectionArticle.append(div6)
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
  query === "rum" ? parentTag = rumSection : parentTag = vodkaSection
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

//CREATE ABOUT 
function createAboutPage(e) {
  const app = document.querySelector("#app")
  if(e.target.matches("#about-page")) {
    app.remove()

    const main = document.createElement("main")
    main.id = "about-page"
    main.className = "about-page"
    app.append(main)
    // console.log(app)
    // console.log(main)

    createApp()

    createHeader()
    aboutProfile()
    createFooter()
  
  }
};

//CREATE APP
function createApp() {
  const body = document.querySelector("body")
  const app = document.createElement("div")
  app.id = "app"
  app.className = "app"
  body.append(app)
}

function aboutProfile() {
  const app = document.querySelector("#app")
  const main = document.getElementById("about-page")
  console.log(main)

  const groupMemberOne = document.createElement("section")
  groupMemberOne.className = "group-member-1"
  main.append(groupMemberOne)

  const div = document.createElement("div")
  div.className = "about-picture"
  groupMemberOne.appendChild(div)

  const profileImg = document.createElement("img")
  profileImg.src = "/img/Christina_Profile.png"
  profileImg.alt = "Christina Profile Picture"
  div.appendChild(profileImg)
  
  const div2 = document.createElement("div")
  div2.className = "about-caption"
  div2.textContent = "I am a graphic and website designer based out of San Diego, California. After graduating with my Bachelors of Science in Business Marketing specializing in Integrated Marketing Communications, I got a job in the non-profit sector designing and creating content. Since opening my own business, Christina Barron Designs, I have gained more work experience the design field and now have enrolled in Digital Crafts Web Development Program to further my education. My favorite drink is a Gin and Tonic and love Kate Sessions park looking over San Diego."
  div.appendChild(div2)

  const groupMemberTwo = document.createElement("section")
  groupMemberTwo.className = "group-member-2"
  main.appendChild(groupMemberTwo)

  const div3 = document.createElement("div")
  div3.className = "about-picture"
  groupMemberTwo.appendChild(div3)

  const profileImg2 = document.createElement("img")
  profileImg2.src = "/img/Christina_Profile.png"
  profileImg2.alt = "John Garcia Profile Picture"
  div3.appendChild(profileImg2)

  const div4 = document.createElement("div")
  div4.className = "about-caption"
  div4.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  div3.appendChild(div4)

  app.appendChild(main)
}

//CREATE SEARCH

// searchOptions.addEventListener("input", (e) => {
//   searchInput.value = e.target.value;
// });
// form.addEventListener("submit", handleSubmit);
// searchInput.addEventListener("keyup", handleKeyUp);

document.addEventListener("click", handleCocktailClick);
document.addEventListener("click", handleBtnClose);
document.addEventListener("click", handleHeart);
document.addEventListener("click", handleFavoriteListOutput);
document.addEventListener("click", handleSingleFavoriteCocktail)
document.addEventListener("click", handleRemoveFavoriteDrink)
document.addEventListener("click", handleLogoHome)
document.addEventListener("click", createAboutPage)
document.addEventListener("click", handleSearchButton)

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