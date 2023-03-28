const drinkSection = document.getElementById("drink-wrap");
const drinkIngredient = document.getElementsByClassName('drinkIngredient')
const fetchUrl = 'https://the-cocktail-db.p.rapidapi.com/randomselection.php';

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'da12acd15cmsh2552fb046e26223p151904jsnef737cab5849',
		'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
	}
};
function getCocktails() {
fetch(fetchUrl, options)
	.then(response => response.json())
	.then((data) => {
		// console.log(data)
		// console.log(data.drinks[0])
		// console.log(data.drinks[0].strDrink)
		displayCocktails(data)
	})
	.catch(err => console.error(err));
}

getCocktails();

// drinkSection.addEventListener("click", function(){
// 	if(drinkIngredient.style.display === "block") {
// 		drinkIngredient.style.display = "none";
// 	} else {
// 		drinkIngredient.style.display = 'block';
// 	}
// });

function displayCocktails(cocktail) {
	console.log(cocktail)

	for(let i=0; i < 10; i++) {
		const div = document.createElement('div');
		div.className = "drink";
		const drinkName = cocktail.drinks[i].strDrink;
		div.append(drinkName);
		drinkSection.append(div);
		
		let img = document.createElement('img');
		img.src = cocktail.drinks[i].strDrinkThumb;
		div.append(img);
		drinkSection.append(div);

		for(let j=1; j<16; j++){

			if (cocktail.drinks[i][`strIngredient${j}`] == null) {
				break;
			} 
			if (cocktail.drinks[i][`strMeasure${j}`] == null) {
				break;
			}
			else {
				const div2 = document.createElement('div')
				div2.className = "drinkIngredient";
				const ingredient = cocktail.drinks[i][`strMeasure${j}`] + cocktail.drinks[i][`strIngredient${j}`];
				div2.append(ingredient);
				drinkSection.append(div2);
			}
		}

		const div3 = document.createElement('div');
		div3.className = "drinkInstructions"
		const instructions = cocktail.drinks[i].strInstructions;
		div3.append(instructions);
		drinkSection.append(div3);
	}
}


