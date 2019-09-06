let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let exphbs = require('express-handlebars');
const moment = require('moment');
let app = express();

let PORT = process.env.PORT || 3000;

// Configure middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());

// Connect to the Mongo DB
let MONGODB_URI =  process.env.MONGODB_URI || 'mongodb://localhost:27017/l5rscrapedb';

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
