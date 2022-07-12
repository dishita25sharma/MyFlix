//will do what postman does - 


import axios from 'axios';

/** base url to make request to the the movie database */


//what will this create do?
const instance = axios.create({
	baseURL: 'https://api.themoviedb.org/3'//url for movies
});
 
// whenever we have to write something like 
// https://api.themoviedb.org/3/foo-bar
// we will only write instance.get('/foo-bar');
// because using create instance has already been made


export default instance;
