// ================================================
//  TRPL Movie - script.js
//  Menggunakan jQuery + OMDb Public API
// ================================================

var API_KEY = 'ace2498';

// ---- fungsi pencarian film ----
function searchMovie() {
  // hilangkan tampilan data movie di html
  $('#movie-list').html('');
  $('#empty-state').hide();

  // request API menggunakan AJAX berdasarkan parameter
  $.ajax({
    url: 'https://www.omdbapi.com/',       // alamat rest server
    type: 'get',                            // type method API
    datatype: 'json',                       // bentuk data yg dihasilkan
    data: {                                 // paramater yang dikirimkan ke rest server
      'apikey': API_KEY,
      's': $('#search-input').val()         // mengambil value dari komponen id="search-input"
    },                                      // end $.ajax

    // jika ajaxnya dikirim maka akan mengembalikan nilai disimpan para variable result
    success: function (result) {
      if (result.Response == "True") {
        // jika data movie ditemukan
        let movies = result.Search; // mengambil objek Search JSON

        // lakukan looping untuk menampilkan data yang ditemukan
        $.each(movies, function (i, data) {
          // tambah tampilan data ke id="movie-list"
          $('#movie-list').append(`
            <div class="col-md-4 col-lg-3 mb-4">
              <div class="card">
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x440?text=No+Poster'}"
                     class="card-img-top" alt="Poster ${data.Title}">
                <div class="card-body">
                  <h5 class="card-title">${data.Title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${data.Year}</h6>
                  <a href="#" class="card-link see-detail"
                     data-toggle="modal"
                     data-target="#exampleModal"
                     data-id="${data.imdbID}">See Detail</a>
                </div>
              </div>
            </div>
          `);
        }); // end $.each(movie, ....)

        $('#search-input').val('');

      } else {
        // jika data movie tidak ditemukan
        $('#movie-list').html('');
        $('#empty-state').show().html(`
          <div class="col">
            <h4 class="text-center">🔍 ${result.Error}</h4>
          </div>
        `);
      } // end if (result.....)
    } // end success: function//
  }); // end $.ajax
}


// ---- panggil searchMovie() saat button-search diklik ----
// javascript akan mencari id "search-button" pada saat event klik lakukan fungsi berikut
$('#button-search').on('click', function () {
  searchMovie();
});


// ---- panggil searchMovie() saat tombol Enter ditekan ----
// javascript akan mencari id "search-input" pada saat tombol enter pada keyboard
$('#search-input').on('keyup', function (event) {
  if (event.which === 13) {
    searchMovie();
  }
});


// ---- tampilkan detail film di modal saat "See Detail" diklik ----
// gunakan teknik event binding yang mejalankan fungsi ketika event tersebut terjadi
// pada saat event komponen class #movie-list di-klik lalu jika ada
// elemen .see-detail yang ada didalam komponen class #movie-list di-klik
// juga maka lakukan panggil data API berdasarkan imdbID
$('#movie-list').on('click', '.see-detail', function () {

  $.ajax({ // data yang diperlukan untuk akses API
    url: 'https://www.omdbapi.com/',
    dataType: 'json',
    type: 'get',
    data: {
      'apikey': API_KEY,
      'i': $(this).data('id'),
    },

    success: function (movie) {
      if (movie.Response === "True") {

        // jika ditemukan tampilkan ke modal
        $('.modal-body').html(`
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-4">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x440?text=No+Poster'}"
                     class="img-fluid">
              </div>
              <div class="col-md-8">
                <ul class="list-group">
                  <li class="list-group-item"><h4>${movie.Title}</h4></li>
                  <li class="list-group-item"><b>Released:</b> ${movie.Released}</li>
                  <li class="list-group-item"><b>Genre:</b> ${movie.Genre}</li>
                  <li class="list-group-item"><b>Director:</b> ${movie.Director}</li>
                  <li class="list-group-item"><b>Actors:</b> ${movie.Actors}</li>
                  <li class="list-group-item"><b>Plot:</b> ${movie.Plot}</li>
                  <li class="list-group-item"><b>Rating:</b> ${movie.imdbRating} / 10</li>
                  <li class="list-group-item"><b>Runtime:</b> ${movie.Runtime}</li>
                  <li class="list-group-item"><b>Country:</b> ${movie.Country}</li>
                </ul>
              </div>
            </div>
          </div>
        `);
      }
    }
  });
});
