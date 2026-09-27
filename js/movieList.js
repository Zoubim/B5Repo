/**
 * Part B5 - MovieList class
 * Purpose: hold the array of Movie objects and provide every operation
 * the user interface needs - add, update, delete, search by ID
 * search by title and the three sort orders. Keeping this logic in its
 * own class separates data handling from page code in app.js
 */

/**
 * MovieList
 * Manages a collection of Movie objects
 */

class MovieList {
    constructor() {
        //movies is the internal array holding every Movie object
        this.movies = [];
    }
    /**
     * getAll
     * returns a copy of every movie in the list
     * @returns {movie[]} a copy of hte movie array
     */

    getAll() {
        return [...this.movies];
    }
    /**findIndexById
     * Finds array position of a movie using sequential search
     * @param {number} movieId - movie ID to look for
     * @returns {number} the array index if found, or -1
     */
    findIndexById(movieId) {
        for (let i = 0; i < this.movies.length; i++) {
            if (this.movies[i].movieId === movieId) {
                return i;
            }
        }
        return -1;
    }
    /**
     * add
     * Adds a movie to the list and must be unique
     * @param {movie} newMovie - new movie to add
     * @returns {object} - new object
     */

    add(newMovie) {
        if (this.findIndexById(newMovie.movieId) !== -1) {
            return {success: false, message: "Movie ID " + newMovie.movieId + " already exists." };
        } else {
            this.movies.push(newMovie);
            return {success: true, message: "Movie " + newMovie.movieId + " has been added."};
        }
    }
    /**
     * Update
     * Replaces the title, year and rating of an existing movie using Movie ID
     * @param {Movie} updatedMovie - movie to be updated
     * @returns {object} a result object with a success flag and message 
     */

    update(updatedMovie) {
        //foundIndex isthe position of hte movie being updated, 
        // or -1 if not found
        const foundIndex = this.findIndexById(updatedMovie.movieId);

        if (foundIndex === -1) {
            return {success: false, message: "Movie ID " + updatedMovie.movieId + "does not exist"};
        }
        this.movies[foundIndex].title = updatedMovie.title;
        this.movies[foundIndex].year = updatedMovie.year;
        this.movies[foundIndex].rating = updatedMovie.rating;
        return {success: true, message: "Movie " + updatedMovie.movieId + "has been updated"};

    }

    /**
     * remove
     * Delets a movie from the list using the movie ID
     * @param {number} movieId - the ID of the movie to delete
     * @returns {object} - a result object with a success flag and a message
     */
    remove(movieId) {
        const foundIndex = this.findIndexById(movieId);
        if (foundIndex === -1) {
            return {success: false, message: "Movie ID " + movieId + "does not exist"}; 
        } 
        this.movies.splice(foundIndex, 1);
        return {success: true, message: "Movie ID" + movieId + "has been deleted"};
    }

    /**
     * searchById
     * Finds a single movie by ID using a binary search. The list is
     * sorted by movie ID first so the binary search precondition is met
     * @param {number} movieId - the movie ID being looked for
     * @returns {Movie} - the matching movie being looked for
     */
    searchById(movieId) {
        //sortedMovies: the list ordered by movie ID - prerequisite to binary search
        const sortedMovies = this.sortByMovieId();
        //LowI lower range of the search
        let lowI = 0;
        //highI upper range of the search
        let highI = sortedMovies.length - 1;
        while (lowI <= highI) {
            //middleI to be calculated
            const middleI = Math.floor((lowI + highI)/2);
            if (sortedMovies[middleI].movieId === movieId) {
                return sortedMovies[middleI];
            }
            if (sortedMovies[middleI].movieId < movieId) {
                lowI = middleI + 1;
            } else {
                highI = middleI - 1;
            }
        }
        return null;
    }

    /**
     * searchByTitle
     * Returns every movie whose title contains the search text
     * The comparison ignores upper and lower case
     * @param {string} searchText - the text to look for inside titles
     * @returns {Movie[]} an array of matching movies if found
     */
    searchByTitle(searchText) {
        //matches the movies whose title contains any of the search text
        const matches = [];
        //lowerSearchText: the search text in lower case for comparison
        const lowerSearchText = searchText.toLowerCase().trim();

        if (lowerSearchText === "") {
            return this.getAll();
        }
        for (const currentMovie of this.movies) {
            if (currentMovie.title.toLowerCase().includes(lowerSearchText)) {
                matches.push(currentMovie);
            }
        }
        return matches;
    }
    /**
     * sortByMovieId
     * Returns the movies ordered by Movie ID, smallest to largest
     * @returns {Movie[]} a new sorted arrary
     */
    sortByMovieId() {
        return this.getAll().sort(function (firstMovie, secondMovie) {
            return firstMovie.movieId - secondMovie.movieId;
        });
    }

    /**
     * sortByTitleAscending
     * Returns the movies ordered by title from A to Z
     * @returns {Movie[]} a new sorted array
     */
    sortByTitleAscending() {
        return this.getAll().sort(function (firstMovie, secondMovie) {
            return firstMovie.title.localeCompare(secondMovie.title);
        });
    }
    /**
     * sortByTitleDescending
     * Returns the movies ordered by title from Z to A
     * @returns {Movie[]} a new sorted array
     */
    sortByTitleDescending() {
        return this.getAll().sort(function(firstMovie, secondMovie) {
            return secondMovie.title.localeCompare(firstMovie.title);
        });
    }

    /**sortByRating
     * Returns the movies ordered by rating from highest to lowest
     * which is the best movies view 
     * @returns {Movie[]} a new sorted array
     */

    sortByRating() {
        return this.getAll().sort(function (firstMovie, secondMovie) {
            return secondMovie.rating - firstMovie.rating;
        });
    }

}