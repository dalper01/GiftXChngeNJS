'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Return Schema
 */
var ReturnSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
    },
    items: [{
            UPC: String,
            title: String
        }],
    //UPC: {
    //    type: String,
    //    default: '',
    //    trim: true,
    //    required: 'UPC cannot be blank'
    //},
    //title: {
    //    type: String,
    //    default: '',
    //    trim: true,
    //    required: 'Title cannot be blank'
    //},
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Return', ReturnSchema);
