// AutoComplete Config for reuse
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
			<img src="${imgSrc}" />
			${movie.Title} (${movie.Year})
		`;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "364c9d8e",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};
// AutoComplete Config End

// createAutoComplete Left Start
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector(".left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
// createAutoComplete Left End

// createAutoComplete Right Start
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector(".right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});
// createAutoComplete Right End

// onMovieSelect Start

let rightMovie;
let leftMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "364c9d8e",
      i: movie.imdbID,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side == "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};
// onMovieSelect End

// runComparison Start
const runComparison = () => {
  const leftSideStat = document.querySelectorAll("#left-summary .notification");
  const rightSideStat = document.querySelectorAll(
    "#right-summary .notification",
  );

  leftSideStat.forEach((leftStat, index) => {
    const rightStat = rightSideStat[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};
// runComparison End

// movieTemplate Start
const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""),
  );
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}</h1>
					<h4>${movieDetail.Genre}</h4>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>

		<article data-value=${awards} class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${metaScore} class="notification is-primary">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification is-primary">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${votes} class="notification is-primary">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};
// movieTemplate End
