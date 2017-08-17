'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Return = mongoose.model('Return'),
    Item = mongoose.model('Item'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    productServiceT = require(path.resolve('./modules/returns/server/services/product.server.service.js')),
    productService = new productServiceT();

/**
 * Create a Return
 */
exports.create = function (req, res) {
    var custReturn = new Return(req.body);
    custReturn.user = req.user;

    custReturn.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(custReturn);
        }
    });
};

/**
 * Show the current return
 */
exports.read = function (req, res) {
    res.json(req.custReturn);
};


// search for Products end point
exports.itemKeywordSearch = function (req, res) {

    var searchParams = {
        lookupKeyword: req.params.keyword,
        offset: req.params.offset || 0
    };

    productService.searchProviderByKeyWord(searchParams)
        .then(function (data) {
            console.log(data);
            data.searchTerm = searchParams.lookupKeyword;
            res.json({ 'data': data });
        }, function (err) {
            console.log(err);
        });

};


exports.validateUPC = function (req, res) {

    var lookupUPC = req.params.upc;
    productService.findItemByUPC(lookupUPC)
        .then(function (data) {
            //console.log('findItemByUPC success');
            //console.log({ 'data': { 'items': data } });

            if (data.length > 0) {
                console.log(data);
                res.json({ 'data': { 'items': data } });
            }
            else {

                var opts = {
                    hostname: 'api.upcitemdb.com',
                    path: '/prod/trial/lookup',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "user_key": "only_for_dev_or_pro",
                        "key_type": "3scale"
                    }
                };

                productService.searchProviderByUPC(opts, lookupUPC)
                    .then(function (data) {


                        // save new Item / Product in db
                        productService.createItem(data.items[0])
                            .then(function (d) {

                                res.json({ 'data': data });

                            }, function (error) {
                                console.log(error);
                                res.json(error);
                            });
                    }, function (error) {
                        console.log(error);
                    });



            }
        }, function (error) {
            console.log('findItemByUPC error');
            console.log(error);
        });

};

/**
 * List of Returns
 */
exports.list = function (req, res) {
    //req.params
    var userId;
    console.log(req.user);

    /* jshint ignore:start*/
    userId = req.user["_id"];
    /* jshint ignore:end */

    console.log("req.user._id");
    console.log(userId);
    //var query = {}

    Return.find({ user: userId }).sort('-created').populate('user', 'displayName').exec(function (err, returns) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            //console.log('number of returns: ' + returns.length);
            res.json(returns);
        }
    });
};


exports.listForUser = function (req, res) {

    console.log(req.user);
    //var req.params
    //Return.find().sort('-created').populate('user', 'displayName').exec(function (err, returns) {
    //    if (err) {
    //        return res.status(400).send({
    //            message: errorHandler.getErrorMessage(err)
    //        });
    //    } else {
    //        res.json(returns);
    //    }
    //});
};

exports.dbitemSearch = function (req, res, params) {
    var keyword = req.body.keyword || 'marvel';
    //Item.find({ 'title': { $regex: keyword , "$options": "i" }}).sort('-created').exec(function (err, items) {
    Item.find({ 'title': { $regex: keyword, "$options": "i" } }).exec(function (err, items) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var data = {
                code: "OK",
                items: items,
                offeset: 0,
                total: items.length,
                lookupKeyword: keyword
            };
            res.json({ data: data });
        }
    });
};

///**
// * Returns middleware
// */
//exports.returnsByID = function (req, res, next, id) {

//  if (!mongoose.Types.ObjectId.isValid(id)) {
//    return res.status(400).send({
//      message: 'Return is invalid'
//    });
//  }

//  Return.findById(id).populate('user', 'displayName').exec(function (err, returnFound) {
//    if (err) {
//      return next(err);
//    } else if (!returnFound) {
//      return res.status(404).send({
//        message: 'No product Return with that identifier has been found'
//      });
//    }
//    req.return = returnFound;
//    next();
//  });
//};
