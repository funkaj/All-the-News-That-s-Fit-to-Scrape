$(document).ready(function () {
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
                <img src='${el.img}'>
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
              <img src='${el.img}'>
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

// event handler for saving articles
$(document).on("click", ".save", function () {

  let thisId = $(this).attr("data-id");
  let thisTitle = document.getElementById(thisId).children[0].children[1].textContent;
  let thisLink = document.getElementById(thisId).children[2].getAttribute('href');
  let thisLead = document.getElementById(thisId).children[1].textContent;
  let thisImg = document.getElementById(thisId).children[0].children[0].getAttribute('src');

  console.log(`thisLink: ${thisImg}`)

  // Run a POST request to save the article
  $.ajax({
      method: "POST",
      url: "/saved",
      data: {
        id: thisId,
        // Value taken from title input
        title: thisTitle,
        // Value taken from link
        link: thisLink,
        // Value taken from lead
        lead: thisLead,
        // Value taken from src
        img: thisImg
      }
    }) // With that done
    .then(function (data) {

      // Log the response
      console.log(data);
      // Empty the notes section

    });


})
// Whenever someone clicks a notes
$(document).on("click", ".note", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id")
  
  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/saved/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      
      $("#notes").append(`   
          <div class="row">
          <div class="col s12">
            <div class="card">
              <div class="card-content black-text">
                <span class="card-title">${data.title}</span>
              </div>
              <div class="card-action">
                <input id='titleinput' name='title' >
                <textarea id='bodyinput' name='body'></textarea>
              </div>
              <div>
              <button class="note waves-effect waves-light btn-large" style='margin: 10px;' data-id=${data._id} id='savenote'>Save Note</button>
              </div>
            </div>
          </div>
        </div>
        `)
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
      url: "/saved/" + thisId,
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