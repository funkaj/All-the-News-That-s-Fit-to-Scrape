$(document).ready(function() {
	$('.sidenav').sidenav();
});
// display RPG Resources articles stored in database
$(document).on('click', '.scrapeRpg', function() {
	$('#articles').empty();
	$.getJSON('/rpg', function(data) {
		let sort = data.sort((e, f) => {
			return (
				moment(f.date).format('YYYYMMDD') - moment(e.date).format('YYYYMMDD')
			);
		});

		data.map(function(el) {
			$('#articles').append(
				`<div id=${el._id} class="card blue-grey darken-1">
					<div class="card-content white-text">
						<span data-id=${el._id} class='card-title flow-text'>${el.title}</span>
						<a href='${el.link}' 'data-id=${el._id} class='center-align'>Read . . .</a>
						<p>${moment(el.date).format('MM/DD/YYYY')}</p>
					</div>
				</div>`
			);
		});
	});
});
// Display fictions from database
$(document).on('click', '.scrapeFiction', function() {
	$('#articles').empty();
	$.getJSON('/fiction', function(data) {
		let sort = data.sort((e, f) => {
			return (
				moment(f.date).format('YYYYMMDD') - moment(e.date).format('YYYYMMDD')
			);
		});
		data.map(function(el) {
			$('#articles').append(
				`<div id=${el._id} class="card blue-grey darken-1">
					<div class="card-content white-text">
						<span data-id=${el._id} class='card-title flow-text'>${el.title}</span>
						<a href='${el.link}' 'data-id=${el._id} class='center-align'>Read . . .</a>
						<p>${moment(el.date).format('MM/DD/YYYY')}</p>
					</div>
				</div>`
			);
		});
	});
});
// Display News stored in database
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
            </div>
        `);
		});
	});
});
