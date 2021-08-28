const searchMovie = document.getElementById('search_movie');
const movieContainer = document.querySelector('.movie_container');
const modalBody = document.querySelector('.modal-body');

searchMovie.addEventListener('keyup', function() {
  document.querySelector('.searching_for > span').textContent = searchMovie.value;

  fetch(`http://www.omdbapi.com/?apikey=e960ac54&s=${searchMovie.value}`)
    .then((response) => {
      if (response.ok === false) {
        throw new Error(response.responseText);
      }
      return response.json();
    })
    .then((results) => {
      console.log(results);

      if (results.Response === "False") {
        throw new Error(results.Error);
      }

      const movies = results.Search;
      let cards = '';
        movies.forEach(e => {
          cards += showMovie(e);
        });
      movieContainer.innerHTML = cards;

      // Ketika tombol "details" diklik, tampilkan informasi mengenai film tersebut
      Array.from(document.querySelectorAll('.modal_detail_btn')).forEach(btn => {
        btn.addEventListener('click', function() {
          // Pemanggilan ajax
          fetch(`http://www.omdbapi.com/?apikey=e960ac54&i=${this.dataset.imdbid}`)

            .then((response) => {
              if (response.ok === false) {
                throw new Error(response.responseText);
              }
              return response.json();
            })
            .then((results) => {
              if (results.Response === "False") {
                throw new Error(results.Error);
              }
              const movieDetail = showMovieDetail(results);
              modalBody.innerHTML = movieDetail;
              lightbox();
            })
            .catch((error) => {
              console.log(error);
              modalBody.innerHTML = errorAPI(error);
            });

        });
      });

    })
    .catch((error) => {
      movieContainer.innerHTML = errorAPI(error);
    });
});

modalBody.innerHTML = loading();

function showMovie(e) {
  return `<div class="col-md-4 my-3" data-aos="fade-up">
  <a href="#" class="modal_detail_btn" data-toggle="modal" data-target="#movieDetail" data-imdbid="${e.imdbID}">
      <div class="card shadow">
        <img src="${e.Poster}" class="card-img-top" alt="${e.Title} image">
        <div class="card-body">
          <h5 class="card-title">${e.Title}</h5>
          <h6 class="card-subtitle mb-3 text-muted">${e.Year}</h6>
          <a href="#" class="btn btn-primary text-light modal_detail_btn" data-toggle="modal" data-target="#movieDetail" data-imdbid="${e.imdbID}">Go Details <i class="bi bi-arrow-right"></i></a>
        </div>
      </div>
    </a>
  </div>`
};

function showMovieDetail(e) {
  return `<div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <img src="${e.Poster}" alt="${e.Title} image" class="img-fluid poster-detail rounded mt-4">
        </div>
        <div class="col-md-6">
          <ul class="list-group">
            <li class="list-group-item"><h4 class="font-weight-bold title-detail mt-2">${e.Title} (${e.Year})</h4></li>
            <li class="list-group-item"><strong>Runtime : </strong>${e.Runtime}.</li>
            <li class="list-group-item"><strong>Country : </strong>${e.Country}.</li>
            <li class="list-group-item"><strong>Production : </strong>${e.Production}.</li>
            <li class="list-group-item"><strong>Director(s) : </strong>${e.Director}.</li>
            <li class="list-group-item"><strong>Writer(s) : </strong> ${e.Writer}.</li>
            <li class="list-group-item"><strong>Actors : </strong>${e.Actors}.</li>
            <li class="list-group-item"><strong>PG Rating : </strong> ${e.Rated}.</li>
            ${checkRatings(e)}
            <li class="list-group-item"><strong>Plot : </strong> <br> ${e.Plot}</li>
            <li class="list-group-item"><strong>Genre : </strong> ${e.Genre}.</li>
            <li class="list-group-item"><strong>Awards : </strong> ${e.Awards}.</li>
          </ul>
        </div>
      </div>
    </div>`
}

function lightbox() {
  const posterDetail = Array.from(document.querySelectorAll('.poster-detail'));
  return posterDetail.forEach((poster) => {
    poster.addEventListener('click', function() {
      document.querySelector('.bg-blur').classList.remove('none');
      document.querySelector('.bg-blur > img').src = this.src;
      document.querySelector('.bg-blur > img').alt = this.src;
      document.querySelector('.bg-blur > #close_lightbox').addEventListener('click', () => {
        document.querySelector('.bg-blur').classList.add('none');
      });
      document.querySelector('.bg-blur').addEventListener('click', () => {
        document.querySelector('.bg-blur').classList.add('none');
      });
    });
  });
}

function checkRatings(e) {
  if (e.Ratings[1] !== undefined) {
    return `<li class="list-group-item"><strong>${e.Ratings[1].Source} : </strong> ${e.Ratings[1].Value}</li>
    <li class="list-group-item"><strong>IMDb Rating : </strong> ${e.imdbRating}</li>`;
  }

  else if (e.Ratings[0] !== undefined) {
    return `<li class="list-group-item"><strong>IMDb Rating : </strong> ${e.Ratings[0].Value}</li>`;
  }

  else if (e.Ratings[2] !== undefined) {
    return `<li class="list-group-item"><strong>${e.Ratings[2].Source} : </strong> ${e.Ratings[2].Value}</li>
    <li class="list-group-item"><strong>IMDb Rating : </strong> ${e.imdbRating}</li>`;
  }
  else {
    return ``;
  }
}

function errorMovieCards() {
  return `<div class="col movie-result-title ml-2 font-weight-bold mt-5">
    <p class="mb-1">Nothing found here.</p>
    <span class=""></span>
  </div>`
}

function loading() {
  return `
    <div class="row text-center justify-content-center">
      <img src="svg/bars.svg" alt="" class="d-block img-fluid svg-img">
    </div>
  `
}

function errorAPI(error) {
  return `<div class="col text-center justify-content-center">
      <p class="font-weight-bold" style="opacity:0.8">${error}</p>
      <img src="svg/undraw_empty_xct9.svg" class="d-block mx-auto svg-img2">
    </div>`;
}










// MENGGUNAKAN jQuery
/*
$.ajax({
  url: `http://www.omdbapi.com/?apikey=e960ac54&s=${searchMovie.value}`,
  success: (results) => {
    const movies = results.Search;
    let cards = '';
      movies.forEach(e => {
        cards += showMovie(e);
      });
    movieContainer.innerHTML = cards;
    console.log(movies);

    // Ketika tombol "details" diklik, tampilkan informasi mengenai film tersebut
    Array.from(document.querySelectorAll('.modal_detail_btn')).forEach(btn => {
      btn.addEventListener('click', function() {
        // Pemanggilan ajax
        $.ajax({
          url: `http://www.omdbapi.com/?apikey=e960ac54&i=${this.dataset.imdbid}`,
          success: (e) => {
            const movieDetail = showMovieDetail(e);
            modalBody.innerHTML = movieDetail;
            lightbox();
          },

          error: (error) => {
            modalBody.innerHTML = errorAPI();
            console.log(error.responseText);
          }
        })
      });
    });

  },

  error: (error) => {
    movieContainer.innerHTML = errorAPI();
    console.log(error.responseText);
  }
});
*/
