/**
 * Part B5 - Movie Class
 * Purpose: Define the movie data type used by the end user. 
 * This is the same class in part B4.
 */

/**
 * --------------
 * B5 from B4.2 - Define movie class
 * --------------
 */

class Movie {
    /**
     * Create a new Movie
     * @param {number} movieId - unique ID for the movie
     * @param {string} title - movie title
     * @param {number} year - year movie was released
     * @param {number} rating - movie rating out of 5
     */

    constructor(movieId, title, year, rating) {
        this.movieId = movieId;
        this.title = title;
        this.year = year;
        this.rating = rating;
    }
}