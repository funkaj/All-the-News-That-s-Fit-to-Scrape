let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let exphbs = require('express-handlebars');
let app = express();

let PORT = process.env.PORT || 3000;

// Configure middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());

// Connect to the Mongo DB
let MONGODB_URI =
	'mongodb://heroku_9j6ztf8c:iiquv49qcj35q0khem4rddk828@ds211083.mlab.com:11083/heroku_9j6ztf8c' ||
	'mongodb://localhost/l5rscrapedb';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Handlebars
app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main',
	})
);
app.set('view engine', 'handlebars');

// Routes
require('./routes/routes')(app);

// Start the server
app.listen(PORT, function() {
	console.log('App running on port ' + PORT + '!');
});

module.exports = app;
