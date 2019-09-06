$(document).ready(function() {
	$('.sidenav').sidenav();
});
// Grab fictions from database
$(document).on('click', '.scrapeFiction', function() {
	$('#articles').empty();
	$.getJSON('/fiction', function(data) {
		let sort = data.sort((e, f) => {
			return (
				moment(f.date).format('YYYYMMDD') - moment(e.date).format('YYYYMMDD')
			);
		});
		sort.map(g => console.log(g.date + '  ' + g.title));
		data.map(function(el) {
			$('#articles').append(`
            <div id=${el._id} class='card'>
            <div class='card-image'>
                <img src='${el.img}'>
                <span data-id=${el._id} class='card-title flow-text'>${el.title}</span>
            </div>
            <div href='${el.link}' class='card-action'>
                <a href='${el.link}' 'data-id=${el._id} class='center-align'>Read . . .</a>
            </div>
            <a class="save waves-effect waves-light btn-large" data-id=${el._id} style='margin: 10px;'>Save Article</a>
            </div>
        `);
		});
	})
})
// Grab the articles as a json
$(document).on('click', '.scrapeArticles', function() {
	$('#articles').empty();

	$.getJSON('/articles', function(data) {
		let sort = data.sort((e, f) => {
			return (
				moment(f.date).format('YYYYMMDD') - moment(e.date).format('YYYYMMDD')
			);
		});
		sort.map(g => console.log(g.date + '  ' + g.title));

		data.map(function(el) {
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
        `);
		});
	});
});
// Grab the saved articles as a json
$(document).on('click', '#saved-articles', function() {
	$('#articles').empty();
	$.ajax({
		method: 'GET',
		url: '/saved',
	}).then(function(data) {
		data.map(function(el) {
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
        </div>`);
		});
	});
});

// event handler for saving articles
$(document).on('click', '.save', function() {
	let thisId = $(this).attr('data-id');
	let thisTitle = document.getElementById(thisId).children[0].children[1]
		.textContent;
	let thisLink = document
		.getElementById(thisId)
		.children[2].getAttribute('href');
	let thisLead = document.getElementById(thisId).children[1].textContent;
	let thisImg = document
		.getElementById(thisId)
		.children[0].children[0].getAttribute('src');

	// Run a POST request to save the article
	$.ajax({
		method: 'POST',
		url: '/saved',
		data: {
			id: thisId,
			title: thisTitle,
			link: thisLink,
			lead: thisLead,
			img: thisImg,
		},
	}).then(function(data) {
		console.log(data);
	});
});
// Whenever someone clicks a notes
$(document).on('click', '.note', function() {
	$('#notes').empty();
	let thisId = $(this).attr('data-id');

	$.ajax({
		method: 'GET',
		url: '/saved/' + thisId,
	}).then(function(data) {
		$('#notes').append(`   
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
        `);
		// If there's a note in the article
		if (data.note) {
			$('#titleinput').val(data.note.title);
			$('#bodyinput').val(data.note.body);
		}
	});
});

// When you click the savenote button
$(document).on('click', '#savenote', function() {
	let thisId = $(this).attr('data-id');

	$.ajax({
		method: 'POST',
		url: '/saved/' + thisId,
		data: {
			title: $('#titleinput').val(),
			body: $('#bodyinput').val(),
		},
	}).then(function(data) {
		$('#notes').empty();
	});

	$('#titleinput').val('');
	$('#bodyinput').val('');
});
