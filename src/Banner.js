import React, { useEffect, useState } from "react";
import axios from "./axios"; //acts like a postman to fetch api
import requests from "./requests"; //url's are stored in variables
import "./Banner.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const API_KEY = "54abf7b99e37b12a01b13becfc2324b3";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTrending);
      //we will get back an array of movies but we want a random movie
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
    }
    fetchData();
  }, []); //we want to run once when the banner component loads

  console.log(movie);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const opts = {
    height: "200",
    width: "22%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log(movie.id);
    setClicked(true);

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
          })
          .catch((error) => console.log(error));
      }
      if (url == null) {
        setTrailerUrl("cdyuHqIyNm8");
      }
    }
  };

  return (
    <header
      onClick={() => handleClick(movie)}
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(
          "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
        )`,
        backgroundPosition: "center center",
      }}
    >
      {/* <<Background Image */}
      <div className="banner_contents">
        {/* ? - optional chaining =>if title/name/original_name does not exist than it will handle it elegently */}
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        <h1 className="banner_title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner_buttons">
          <button className="banner_button" onClick={() => handleClick(movie)}>
            {/* {clicked ? null : "Play"} */} Play
          </button>
          {/* <button className="banner_button"> My List</button> */}
        </div>
        <h1 className="banner_description">
          {clicked ? null : truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="banner-fadeBottom"></div>
    </header>
  );
}

export default Banner;
