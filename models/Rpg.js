const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RpgSchema = new Schema({
	img: {
		type: String,
		trim: true,
		required: true,
	},
	lead: {
		type: String,
		required: true,
	},
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

let Rpg = mongoose.model('Rpg', RpgSchema);

module.exports = Rpg;
