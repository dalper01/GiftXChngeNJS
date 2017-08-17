'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Return = mongoose.model('Return'),
    Item = mongoose.model('Item'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


module.exports = function () {
    var prodServ = this;
    function utf8ArrayToStr(array) {
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


    // search database for Item
    prodServ.findItemByUPC = function (upc) {
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
    prodServ.createItem = function (item) {

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
    };

    prodServ.searchProviderByKeyWord = function (searchParams) {

        var querystring = require('querystring');

        var chunks = [];

        var lookupReturnData;
        var jsonReturnData = '';
        var https = require('https');

        var postArgs = JSON.stringify({
            "s": searchParams.lookupKeyword,
            "offset": searchParams.offset,
            "match_mode": 1
        });

        var opts = {
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
        };

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
                    var returnString = utf8ArrayToStr(Buffer.concat(chunks));
                    jsonReturnData = JSON.parse(returnString);
                    resolve(jsonReturnData);
                });
            });

            upcitemdbReq.on('error', function (e) {
                console.log('problem with request: ' + e.message);
                reject(e);
            });
            upcitemdbReq.write(postArgs);
            upcitemdbReq.end();
        });
    };

    prodServ.searchProviderByUPC = function (opts, lookupUPC) {

        var lookupReturnData;
        var jsonReturnData;
        var https = require('https');

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
                });
            });

            upcitemdbReq.on('error', function (e) {
                console.log('problem with request: ' + e.message);
                reject(e);
            });
            upcitemdbReq.write('{ "upc": "' + lookupUPC + '" }');
            // other requests
            upcitemdbReq.end();
        });
    };


};


