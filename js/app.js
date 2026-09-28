/**
 * Part B5 - Movie Database app.js
 * Purpose: Connect HTML page to the MovieList class
 * This file reads the form inputs, calls the
 * matching MovieList method and renders the results back onto the page
 */

/**
 * Initialize app
 */

// movieList the single MovieList instance that holds all 
// application data 
const movieList = new MovieList();

// seedMovies - the mock data loaded when the page first opens
let seedMovies = [
    new Movie(115, "The Shawshank Redemption", 1994, 5),
    new Movie(113, "The Godfather", 1972, 5 ),
    new Movie(111, "The Godfather: Part II", 1974, 3 ),
    new Movie(112, "The Dark Knight", 2008, 5 ),
    new Movie(120, "Krull", 1983, 1 ),
    new Movie(121, "The Last Starfigher", 1981, 1 ),
    new Movie(107, "The Longest Day", 1962, 5 ),
    new Movie(103, "Blade Runner", 1982, 3 ),
    new Movie(110, "Jaws", 1975, 4),
    new Movie(101, "Alien", 1979, 5)
];



/**
 * renderMovieTable
 * Draws an array of movies into a table inside the given container
 * @param {string} containerId - the id of the leement to draw the table into
 * @param {Movie[]} moviesToShow - the movies to display
 * @param {string} emptyText - the text shown when array is empty
 * @returns {void} 
 */
function renderMovieTable(containerId, moviesToShow, emptyText) {
    // containerElement - the page element the table is written into
    const containerElement = document.getElementById(containerId);

    if (moviesToShow.length === 0) {
        containerElement.innerHTML = emptyText;
        return;
    }
    // tableRows: the HTML for the body of the table, built row by row
    let tableRows = "";

    for (const currentMovie of moviesToShow) {
        tableRows += "<tr>";
        tableRows += "<td>" + currentMovie.movieId + "</td>";
        tableRows += "<td>" + currentMovie.title + "</td>";
        tableRows += "<td>" + currentMovie.year + "</td>";
        tableRows += "<td>" + currentMovie.rating + "</td>";
        tableRows += "</tr>";
    }
    containerElement.innerHTML = 
        "<table class=\"movie-table\">" +
        "<thead><tr><th>Movie ID</th><th>Title</th><th>Year</th><th>Rating</th></tr></thead>" +
        "<tbody>" + tableRows + "</tbody>" +
        "</table>";


}

/**
 * refreshMovieList
 * Redraws the display list view with the current contest of the movie array
 * @returns {void}
 */

function refreshMovieList() {
    renderMovieTable("movieListView", movieList.sortByMovieId(), 
    "There are no movies in the list.");
}

/**
 * readFormInpus
 * Reads and validates teh four maintenance form inputs
 * @param {boolean} requireAllFields - false when only the movie ID is needed
 * @returns {object} an object with a valid flag, a movie and a message
 */

function readFormInputs(requireAllFields) {
    //movieIdText - the text in the movie ID input
    const movieIdText = document.getElementById("movieIdInput").value.trim();
    //titleText - the text in the title input
    const titleText = document.getElementById("titleInput").value.trim();
    //yearText - the text in the year input
    const yearText = document.getElementById("yearInput").value.trim();
    //ratingText - the text in the rating input
    const ratingText = document.getElementById("ratingInput").value.trim();

    if (movieIdText === "" || isNaN(Number(movieIdText))) {
        return {valid: false, message: "Enter a valid Movie ID"};
    }
    if (!requireAllFields) {
        return {valid: true, movie: new Movie(Number(movieIdText), "", 0, 0), 
            message: ""};
    }
    if (titleText === "") {
        return {valid: false, message: "Enter a title"};
    }
    if (yearText === "" || isNaN(Number(yearText))) {
        return {valid: false, message: "Enter a valid year"};
    }
    if (ratingText === "" || isNaN(Number(ratingText)) || 
    Number(ratingText) < 1 || Number(ratingText) > 5) {
        return {valid: false, message: "Enter a Rating between 1 and 5"}
    }
    return {
        valid: true,
        movie: new Movie(Number(movieIdText), titleText,
    Number(yearText), Number(ratingText)),
    message: ""
    };

}

/**
 * clearFormInputs
 * Empties the four maintenance form inputs
 * @returns {void}
 */
function clearFormInputs() {
    document.getElementById("movieIdInput").value = "";
    document.getElementById("titleInput").value = "";
    document.getElementById("yearInput").value = "";
    document.getElementById("ratingInput").value = "";
}
/**
 * handleSubmit
 * runs when the submit button is clicked
 * Action is decided by the radio button (add, edit, delete)
 * @param {Event} submitEvent the form submit event
 * @returns {void}
 */
function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    // selectedAction: add, update or delete radio button
    const selectedAction = document.querySelector("input[name=\"maintenanceAction\"]:checked").value;
    // formResult is the validated inputs or the reason validation failed
    const formResult = readFormInputs(selectedAction !== "delete");
    if (!formResult.valid) {
        showMessage(formResult.message, true);
        return;
    }

    //actionResult - the outcome reported by MovieList method
    let actionResult;
    if (selectedAction === "add") {
        actionResult = movieList.add(formResult.movie);
    } else if (selectedAction === "update") {
        actionResult = movieList.update(formResult.movie);
    } else {
        actionResult = movieList.remove(formResult.movie.movieId);
    }
    showMessage(actionResult.message, !actionResult.success);
    if (actionResult.success) {
        clearFormInputs();
    }
    refreshMovieList();
}

/**
 * handleSearchById
 * Runs when the search button is clicked
 * Displays the matching movie if found
 * @returns {void}
 */
function handleSearchById() {
    // searchIdText - the text in the search by ID input
    const searchIdText = document.getElementById("searchInput").value.trim();
    // resultElement - the element the search result is written into
    const resultElement = document.getElementById("searchResultView");

    if (searchIdText === "" || isNaN(Number(searchIdText))) {
        resultElement.innerHTML = "<p class=\"empty\">Enter a valid Movie ID to search for</p>";
        return;
    }
    //foundMovie is the matching movie, if found
    const foundMovie = movieList.searchById(Number(searchIdText));

    if (foundMovie === null) {
        resultElement.innerHTML = "<p class=\"empty\">0 results</p>";
        return;
    }
    renderMovieTable("searchResultView", [foundMovie], "0 results");
}
/**
 * handleSearchByTitle
 * Runs when the search title button is clicked
 * Shows every movie whos title matches the text
 * @returns {void}
 */
function handleSearchByTitle() {
    //searchTitleText - the text written into the search by title input
    const searchTitleText = document.getElementById("searchTitleInput").value;
    // matches - every movie whose title contains the search text
    const matches = movieList.searchByTitle(searchTitleText);
    renderMovieTable("movieListView", matches, "0 results")
}

/**
 * handleSortAscending
 * Runs when the sort A-Z button is clicked
 * @returns {void}
 */
function handleSortAscending() {
    renderMovieTable("movieListView", movieList.sortByTitleAscending(), "There are no movies in the list");
}

/**
 * handleSortDescending
 * Runs when the sort Z-A is clicked
 * @returns {void}
 */
function handleSortDescending() {
    renderMovieTable("movieListView", movieList.sortByTitleDescending(), "There are no movies in the list");

}

/**
 * handleBestMovies
 * Runs when the best movies button is clicked
 * Orders the list by rating from highest to lowest
 * @returns {void}
 */

function handleBestMovies() {
    renderMovieTable("movieListView", movieList.sortByRating(), "Movie list is empty");
}
/**
 * initApp
 * Initialize the app
 * Load the mock data
 * Wire the buttons
 * Draw first version of the list 
 * @returns {void}
 */

function initApp() {
    for (const seedMovie of seedMovies) {
        movieList.add(seedMovie);
    }
    document.getElementById("maintenanceForm").addEventListener("submit", handleSubmit);
    document.getElementById("refreshButton").addEventListener("click", refreshMovieList);
    document.getElementById("searchIdButton").addEventListener("click", handleSearchById);
    document.getElementById("searchTitleButton").addEventListener("click", handleSearchByTitle);
    document.getElementById("sortAscendingButton").addEventListener("click", handleSortAscending);
    document.getElementById("sortDescendingButton").addEventListener("click", handleSortDescending);
    document.getElementById("bestMoviesButton").addEventListener("click", handleBestMovies);
    refreshMovieList();
}
document.addEventListener("DOMContentLoaded", initApp);