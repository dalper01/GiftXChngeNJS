'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var OffersSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	upc: {
		type: String,
		default: '',
		trim: true,
		required: 'UPC cannot be blank'
	},
	ean: {
		type: String,
		default: '',
		trim: true
	},
	title: {
		type: String,
		default: '',
		trim: true
	},
	brand: {
		type: String,
		default: '',
		trim: true
	},
	model: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	color: {
		type: String,
		default: '',
		trim: true
	}, size: {
		type: String,
		default: '',
		trim: true
	}, dimensions: {
		type: String,
		default: '',
		trim: true
	}, weight: {
		type: String,
		default: '',
		trim: true
	},
	images: [{
		type: String
	}]
});

mongoose.model('Offer', OffersSchema);
