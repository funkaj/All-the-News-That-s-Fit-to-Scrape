const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		trim: true,
		required: true,
	},
	lead: {
		type: String,
		required: true,
	},

	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note',
	},
});

let Saved = mongoose.model('Saved', SavedSchema);

module.exports = Saved;
