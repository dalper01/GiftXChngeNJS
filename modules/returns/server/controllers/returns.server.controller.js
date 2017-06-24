'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Return = mongoose.model('Return'),
    Item = mongoose.model('Item'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;
    
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) { 
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
                break;
        }
    }
    
    return out;
}


var findItemByUPC = function (upc) {
        // Find Product / Item in DB
        return new Promise(function (resolve, reject) {
        Item.find({ 'upc': upc }).exec(function (err, item) {
            if (err) {
                reject(err);
            } else {
            resolve(item);
            }
        });
    });
};


// Save new Item/Product to DB
var createItem = function (item) {
    
    return new Promise(function (resolve, reject) {
        console.log("createItem");
        var newItem = new Item();
        //Object.assign(newItem, item);
        newItem.upc = item.upc;
        newItem.ean = item.ean;
        newItem.title = item.title;
        newItem.brand = item.brand;
        newItem.model = item.model;
        newItem.description = item.description;
        newItem.color = item.color;
        newItem.size = item.size;
        newItem.dimensions = item.dimensions;
        newItem.weight = item.weight;
        newItem.images = item.images;
        
        newItem.save(function (err) {
            if (err) {
                reject(err);
                
                console.log(err);
            } else {
                resolve(true);
                console.log('Product Added to Database' + ' - ' + item.title + ' - ' + item.upc);
            }
        });
    });
}

var searchProviderByKeyWord = function (searchParams) {
    
    var querystring = require('querystring');

    var chunks = [];

    var lookupReturnData;
    var jsonReturnData = '';
    const https = require('https');

    var postArgs = JSON.stringify({
        "s": searchParams.lookupKeyword,
        "offset": searchParams.offset,
        "match_mode": 1
    });

    const opts = {
        hostname: 'api.upcitemdb.com',
        path: '/prod/trial/search',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "user_key": "only_for_dev_or_pro",
            "key_type": "3scale",
            "connection": "keep-alive",
            'Content-Length': Buffer.byteLength(postArgs)
        }
    }
        
    return new Promise(function (resolve, reject) {
        
        var upcitemdbReq = https.request(opts, function (response) {
            console.log('statusCode: ', response.statusCode);
            console.log('headers: ', response.headers);
            
            // success
            response.on('data', function (d) {
                chunks.push(d);
                console.log('BODY: ' + d);
            });

            response.on('end', function () {
                var returnString = Utf8ArrayToStr(Buffer.concat(chunks));
                jsonReturnData = JSON.parse(returnString);
                resolve(jsonReturnData);
            });
        });
        
        upcitemdbReq.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            reject(e);
        })
        upcitemdbReq.write(postArgs);
        upcitemdbReq.end();
    });
}

var searchProviderByUPC = function (opts, lookupUPC) {
    
    var lookupReturnData;
    var jsonReturnData;
    const https = require('https')
    
    return new Promise(function (resolve, reject) {

        var upcitemdbReq = https.request(opts, function (response) {
            
            console.log('statusCode: ', response.statusCode);
            console.log('headers: ', response.headers);
            
            // success
            response.on('data', function (d) {
                
                // convert from uint8array format to string to object
                jsonReturnData = d.toString();
                lookupReturnData = JSON.parse(jsonReturnData);
                console.log('BODY: ' + d);
                //console.log('jsonReturnData: ' + jsonReturnData);
                //console.log('lookupReturnData: ' + lookupReturnData);
                                
                resolve(lookupReturnData);
            })
        });
        
        upcitemdbReq.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            reject(e);
        })
        upcitemdbReq.write('{ "upc": "' + lookupUPC + '" }')
        // other requests
        upcitemdbReq.end()
    });
}

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
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.custReturn);
};


// search for Products end point
exports.itemKeywordSearch = function (req, res) {
    
    var searchParams = {
        lookupKeyword: req.params.keyword,
        offset: req.params.offset || 0
    }
    
    //exports.dbitemSearch(req, res, searchParams);
    searchProviderByKeyWord(searchParams)
    .then(function (data) {
        console.log(data);
        data.searchTerm = searchParams.lookupKeyword;
        res.json({ 'data': data });
    }), function (err) {
        console.log(err);  
    };

     //write UPC to Database

}


exports.validateUPC = function (req, res) {
    
    var lookupUPC = req.params.upc;
    findItemByUPC(lookupUPC)
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
            }
            
            searchProviderByUPC(opts, lookupUPC)
            .then(function (data) {
                
                
                // save new Item / Product in db
                createItem(data.items[0])
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
    }), function (error) {
        console.log('findItemByUPC error');
        console.log(error);
    };

}








/**
 * Update a article
 */
//exports.update = function (req, res) {
//  var article = req.article;

//  article.title = req.body.title;
//  article.content = req.body.content;

//  article.save(function (err) {
//    if (err) {
//      return res.status(400).send({
//        message: errorHandler.getErrorMessage(err)
//      });
//    } else {
//      res.json(article);
//    }
//  });
//};

///**
// * Delete an article
// */
//exports.delete = function (req, res) {
//  var article = req.article;

//  article.remove(function (err) {
//    if (err) {
//      return res.status(400).send({
//        message: errorHandler.getErrorMessage(err)
//      });
//    } else {
//      res.json(article);
//    }
//  });
//};

/**
 * List of Returns
 */
exports.list = function (req, res) {
    //req.params
    Return.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};

exports.dbitemSearch = function (req, res, params) {
    var keyword = req.body.keyword || 'marvel';
    //Item.find({ 'title': { $regex: keyword , "$options": "i" }}).sort('-created').exec(function (err, items) {
    Item.find({ 'title': { $regex: keyword , "$options": "i" } }).exec(function (err, items) {
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
// * Article middleware
// */
//exports.articleByID = function (req, res, next, id) {

//  if (!mongoose.Types.ObjectId.isValid(id)) {
//    return res.status(400).send({
//      message: 'Article is invalid'
//    });
//  }

//  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
//    if (err) {
//      return next(err);
//    } else if (!article) {
//      return res.status(404).send({
//        message: 'No article with that identifier has been found'
//      });
//    }
//    req.article = article;
//    next();
//  });
//};
