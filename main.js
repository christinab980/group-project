const output = document.getElementById("output")
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'da12acd15cmsh2552fb046e26223p151904jsnef737cab5849',
		'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
	}
};

fetch('https://the-cocktail-db.p.rapidapi.com/randomselection.php', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

