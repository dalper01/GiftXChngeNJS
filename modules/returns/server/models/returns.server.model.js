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
    //returnItems: [{
    //        type: Schema.ObjectId,
    //        ref: 'Item'
    //    }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Return', ReturnSchema);
