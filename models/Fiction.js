const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FictionSchema = new Schema({
	date: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note',
	},
});

let Fiction = mongoose.model('Fiction', FictionSchema);

module.exports = Fiction;