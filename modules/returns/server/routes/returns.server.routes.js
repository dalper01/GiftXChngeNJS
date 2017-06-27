'use strict';

/**
 * Module dependencies.
 */
//var articlesPolicy = require('../policies/articles.server.policy'),
  var returns = require('../controllers/returns.server.controller');

module.exports = function (app) {
  //// Returns collection routes
    app.route('/api/returns')//.all(articlesPolicy.isAllowed)
    .get(returns.list)
    //.get(function () { 
    //    return { }
    //})
    .post(returns.create);

    app.route('/api/validupc/:upc')
    .get(returns.validateUPC);
    app.route('/api/keywordsearch/:keyword')
    .get(returns.itemKeywordSearch);
    app.route('/api/bditemsearch/:keyword')
    .get(returns.dbitemSearch);

    
    //app.route('/api/searchproduct/:keyword')
    //.get(returns.searchProduct);

//  //// Single article routes
//  //app.route('/api/returns/:returnId') //.all(articlesPolicy.isAllowed)
//  //  .get(returns.read)
//  //  .put(returns.update)
//  //  .delete(returns.delete);

//  //// Finish by binding the return middleware
    //app.param('upc', returns.returnByID);
//  //app.param('returnId', returns.returnByID);
};
