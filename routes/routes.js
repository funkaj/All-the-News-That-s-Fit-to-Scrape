const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
const moment = require('moment');

module.exports = function(app) {
	// Routes
	app.get('/', function(req, res) {
		res.render('index');
	});
	// route for scraping by id
	app.get('/scraped/:id', function(req, res) {
		let id = req.params.id
		let url;
		let model;
		console.log(id)
		switch (id) {
			case 'news':
				url =  'https://www.fantasyflightgames.com/en/news/tag/legend-of-the-five-rings-the-card-game/?page=1';
				model = db.Article;
			break;
			case 'fiction':
				url =  'https://www.fantasyflightgames.com/en/legend-of-the-five-rings-fiction/';
				model = db.Fiction;
			break;
			case 'rpg':
				url =  'https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game/';
				model = db.Rpg;
			break;
			default:

		}
console.log(url + ' ' + model)
	axios
		.get(url)
		.then(function(response) {
			console.log(
				'=======================SCRAPE response======================'
			);
			let $ = cheerio.load(response.data);
			if (model === db.Article) {
			$('.blog-item').each(function(i, element) {
				// Save an empty result object
				const result = {};
				// Add the text and href of every link, and save them as properties of the result object
				result.title = $(this)
					.children('.blog-text')
					.children('h1')
					.children('a')
					.text();
				let oldDate = $(this)
					.children('.blog-text')
					.children('.blog-meta')
					.children('.meta-date')
					.text();
				result.date = moment(oldDate).format('YYYY-MM-DD');
				result.link = $(this)
					.children('.blog-text')
					.children('h1')
					.children('a')
					.attr('href');
				result.img = $(this)
					.children('.blog-img')
					.children('a')
					.children('img')
					.attr('src');
				result.lead = $(this)
					.children('.blog-text')
					.children('.blog-lead')
					.children('p')
					.text();
				// Create a new Article using the `result` object built from scraping
				const query = { title: result.title };
				console.log(query);
				model.updateMany(query, result, { upsert: true })
					.then(function(dbModel) {
						console.log(dbModel);
					})
					.catch(function(err) {
						return res.json(err);
					});
			});
		} else {
			$('.support-item').each(function(i, element) {
				// Save an empty result object
				const result = {};
				// Add the text and href of every link, and save them as properties of the result object
				result.title = $(this)
					// .children('a')
					.children('.title')
					.text()
				let oldDate = $(this)
					// .children('a')
					.children('.date')
					.text();
				result.date = moment(oldDate).format('YYYY-MM-DD');
				result.link = $(this)
					.attr('href');
				// Create a new Article using the `result` object built from scraping
				const query = { title: result.title };
				console.log(query);
				model.updateMany(query, result, { upsert: true })
					.then(function(dbmodel) {
						console.log(dbmodel);
					})
					.catch(function(err) {
						return res.json(err);
					});
			});
		}
			res.render('index');
		})
	})

	// Route for getting all Articles from the db
	app.get('/articles', function(req, res) {
		db.Article.find({})
			.then(function(dbArticle) {
				res.json(dbArticle);
			})
			.catch(function(err) {
				res.json(err);
			});
	});

	// Route for getting all fiction from the db
	app.get('/fiction', function(req, res) {
		db.Fiction.find({})
			.then(function(dbFiction) {
				res.json(dbFiction);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
	// Route for getting all rpg supplements from the db
	app.get('/rpg', function(req, res) {
		db.Rpg.find({})
			.then(function(dbRpg) {
				res.json(dbRpg);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
};
