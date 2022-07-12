import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

//using props - title to get the heading of the Row
function Row({ title, fetchUrl, isLargeRow }) {
  //using state to store movies temporarily
  // initial state - empty array
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //when row loads we want to make a
  //request to tmdb server
  //i.e as soon as the row loads we have to feed in data to row
  useEffect(() => {
    //async function's syntax changes inside useEffect
    async function fetchData() {
      //when you make the request wait for answer/promise to come back
      //when it comes back then do something
      const request = await axios.get(fetchUrl);

      // //to get to know what's coming from api call
      // console.log(request);

      //after console logging we found out that movies are inside results and result is inside data
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); // if any variable from outside is being used inside use effect we will include it inside []. why-? because otherwise even if the fetchUrl changes than also our app won't render for new url it will stay the same

  // [] - run once when the row loads, and don't run again
  // if something like this were written useEffect(()=>{},[movies])
  // [movies] - run once when the row loads, and run again when movie changes

  // console.log(movies);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log(movie.id);

    if (trailerUrl) {
      // if video was open and picture was clicked, set trailerUrl to empty
      setTrailerUrl(""); //if we are clicking picture twice
    } else {
      const url = null;
      //movieTrailer is an npm module, we can use it by putting a movie name in () and movie trailer  will be displayed
      movieTrailer(null, { tmdbId: movie.id })
        // then because promise
        .then((url) => {
          // https://www.youtube.com/watch?v=XtMThy8QKqU&t=6423s
          const urlParams = new URLSearchParams(new URL(url).search); // trick to get everything after the question mark(reference above link) because that is what we need to play movie trailer
          console.log(urlParams);
          setTrailerUrl(urlParams.get("v")); //use the link part written after v=
        })
        .catch((error) => console.log(error));
      if (url == null) {
        movieTrailer(movie?.name || "")
          .then((url) => {
            // console.log("url is " + url);
            const urlParams = new URLSearchParams(new URL(url).search);
            console.log("urlParamsn" + urlParams);
            setTrailerUrl(urlParams.get("v"));
            console.log(movies);
          })
          .catch((error) => console.log(error));
      }
      if (url == null) {
        setTrailerUrl("UUxD4-dEzn0");
      }
    }
  };
  //     movieTrailer(movie?.name || "")
  //       .then((url) => {
  //         // console.log("url is " + url);
  //         const urlParams = new URLSearchParams(new URL(url).search);
  //         console.log("urlParamsn" + urlParams);
  //         setTrailerUrl(urlParams.get("v"));
  //         console.log(movies);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // };

  // console.log(movies[0].id);

  // // console.log(tmdbId);

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {/* posters are kept inside a conatiner because we have to scroll through them
               movie posters */}

        {/* mapping through all the array objects */}
        {movies.map((movie) => (
          <img
            // giving each poster a separate id so that in future if we want to make any change we can use the key
            key={movie.id}
            // if the row is large row_posterLarge class is also assigned to it
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movies.name}
          />
        ))}
      </div>

      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
