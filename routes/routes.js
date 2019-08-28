const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
require('moment')
module.exports = function(app) {
	// Routes
	app.get('/', function(req, res) {
		res.render('index');
	});
	// A GET route for scraping the FFG website
	app.get('/scrape', function(req, res) {
		axios
			.get(
				'https://www.fantasyflightgames.com/en/news/tag/legend-of-the-five-rings-the-card-game/?page=1'
			)
			.then(function(response) {
				console.log('=======================response======================')
				let $ = cheerio.load(response.data);
				// Now, we grab every h within an article tag, and do the following:
				$('.blog-item').each(function(i, element) {
					// Save an empty result object
					const result = {};
					// Add the text and href of every link, and save them as properties of the result object
					result.title = $(this)
						.children('.blog-text')
						.children('h1')
						.children('a')
						.text();
					result.date = $(this)
						.children('.blog-text')
						.children('.blog-meta')
						.children('.meta-date')
						.text();
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
					const query = {title: result.title}
					console.log(query)
					db.Article.updateMany(query, result, {upsert: true})
						.then(function(dbArticle) {
							console.log(dbArticle);
						})
						.catch(function(err) {
							return res.json(err);
						});
				});
				res.render('index');
			});
	});

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

	// Route for grabbing a specific Article by id, populate it with it's note
	app.get('/articles/:id', function(req, res) {
		db.Article.findOne({
			_id: req.params.id,
		})
			.populate('note')
			.then(function(dbArticle) {
				res.json(dbArticle);
			})
			.catch(function(err) {
				res.json(err);
			});
	});

	// Route for grabbing a specific saved Articles
	app.get('/saved', function(req, res) {
		db.Saved.find({})
			.then(function(dbSaved) {
				res.json(dbSaved);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
	// Route for saving/updating an Saved
	app.post('/saved', function(req, res) {
		db.Saved.create(req.body)
			.then(function(dbSaved) {
				res.json(dbSaved);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
	app.get('/saved/:id', function(req, res) {
		db.Saved.findOne({
			_id: req.params.id,
		})
			.populate('note')
			.then(function(dbSaved) {
				res.json(dbSaved);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
	// Route for saving/updating an Article's associated Note
	app.post('/saved/:id', function(req, res) {
		db.Note.create(req.body)
			.then(function(dbNote) {
				return db.Saved.findOneAndUpdate(
					{
						_id: req.params.id,
					},
					{
						note: dbNote._id,
					},
					{
						new: true,
					}
				);
			})
			.then(function(dbSaved) {
				res.json(dbSaved);
			})
			.catch(function(err) {
				res.json(err);
			});
	});
};
