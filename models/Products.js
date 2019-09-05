const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
	
	title: {
		type: String,
		required: true,
	},

});

let Products = mongoose.model('Products', ProductsSchema);

module.exports = Products;
