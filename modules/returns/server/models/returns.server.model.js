'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemModel = require('./products.server.model.js');

/**
 * Return Schema
 */
var ReturnSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
    },
    returnItems: [ItemModel], 
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  offers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Return', ReturnSchema);
