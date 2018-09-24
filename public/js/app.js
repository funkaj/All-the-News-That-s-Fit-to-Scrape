$(document).ready(function(){
    $('.sidenav').sidenav();
  });
// Grab the articles as a json
$(document).on("click", "#scrapeSite", function () {
  $('#articles').empty();
  $.getJSON("/articles", function (data) {

    // For each one
    data.map(function (el) {

      // Display the apropos information on the page
      $('#articles').append(`
            <div id=${el._id} class='card'>
              <div class='card-image'>
                <img src='${el.src}'>
                <span data-id=${el._id} class='card-title flow-text'>${el.title}</span>
              </div>
              <div class='card-content'>
                <p>${el.lead}</p>
              </div>
              <div href='https://www.fantasyflightgames.com${el.link}' class='card-action'>
                <a href='https://www.fantasyflightgames.com${el.link}' 'data-id=${el._id} class='center-align'>Read . . .</a>
              </div>
              <a class="save waves-effect waves-light btn-large" data-id=${el._id} style='margin: 10px;'>Save Article</a>
            </div>
        `)

    })
  })
})
// Grab the saved articles as a json
$(document).on('click', '#saved-articles', function () {
  $('#articles').empty();
  console.log('clicked')
  $.ajax({
    method: 'GET',
    url: '/saved'
  }).then(function (data) {

    data.map(function (el) {

      // Display the apropos information on the page
      $('#articles').prepend(`
          <div id=${el._id} class='card'>
            <div class='card-image'>
              <img src='${el.src}'>
              <span data-id=${el._id} class='card-title flow-text'>${el.title}</span>
            </div>
            <div class='card-content'>
              <p>${el.lead}</p>
            </div>
            <div class='card-action'>
              <a href='https://www.fantasyflightgames.com${el.link}' 'data-id=${el._id}'>Read Me</a>
            </div>
            <a class="note waves-effect waves-light btn-large" data-id=${el._id} style='margin: 10px;'>Notes</a>
          </div>
      `)

    })
  })
})


$(document).on("click", ".save", function () {

  let thisId = $(this).attr("data-id");
  let thisTitle = document.getElementById(thisId).children[0].textContent;
  let thisLink = document.getElementById(thisId).children[2].getAttribute('href');

  console.log(`thisLink: ${thisTitle}`)

  // Run a POST request to save the article
  $.ajax({
      method: "POST",
      url: "/saved",
      data: {
        id: thisId,
        // Value taken from title input
        title: thisTitle,
        // Value taken from note textarea
        link: thisLink
      }
    }) // With that done
    .then(function (data) {

      // Log the response
      console.log(data);
      // Empty the notes section

    });


})
// Whenever someone clicks a p tag
$(document).on("click", ".note", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id")
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>")
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});