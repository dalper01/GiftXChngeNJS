'use strict';

// Configure the 'chat' module routes
angular.module('returns').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
        .state('newreturn', {
            url: '/newreturn',
            templateUrl: 'modules/returns/client/views/returns.client.createReturn.html',
            controller: 'ReturnsController',
            data: {
                //roles: ['user', 'admin']
            }
        })
        .state('productsearch', {
            url: '/productsearch',
            templateUrl: 'modules/returns/client/views/returns.client.view.findproducts.html',
            controller: 'ReturnsController',
            data: {
                //roles: ['user', 'admin']
            }
        })
        .state('testconfirmreturn', {
            url: '/testconfirmreturn',
            params: {
                confirmReturn: null
            },            
            templateUrl: 'modules/returns/client/views/returns.client.confirmReturnView.html',
            controller: function ($scope) {
                $scope.createDate = new Date();
                $scope.confirmReturn = {
                    "_id" : "5951b08724eb3ab8347a9a3b", 
                    "user" : "5944d8a8cf893738437b4f26", 
                    "returnItems" : [
                        {
                            "created" : "2017-06-23T03:50:31.292Z", 
                            "upc" : "630509329175", 
                            "ean" : "0630509329175", 
                            "title" : "Marvel Legends Infinite Series Marvel's White Tiger", 
                            "brand" : "Hasbro", 
                            "model" : "B1F1BEC6", 
                            "description" : "Marvel Legends Infinite Series Marvel's White Tiger Type: Other Theme: Animals Manufacturer Recommended Age: 4 Character: Spider-Man Age: 5-7 Years,8-11 Years Gender: Boys", 
                            "color" : "Black", 
                            "size" : "", 
                            "dimensions" : "", 
                            "weight" : "0.4 Pounds", 
                            "images" : [
                                "http://8016235491c6828f9cae-6b0d87410f7cc1525cc32b79408788c4.r96.cf2.rackcdn.com/1752/85537944_1.jpg", 
                                "http://images10.newegg.com/ProductImageCompressAll200/A3G6_1_20161219493839484.jpg", 
                                "https://i5.walmartimages.com/asr/2f964b3f-db10-42f8-9d51-a4a706ada73a_1.8a3ee6c22259b2a482753af844a6c650.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff", 
                                "http://img1.r10.io/PIC/112453708/0/1/250/112453708.jpg", 
                                "http://images10.newegg.com/ProductImageCompressAll200/A3G6_1_20150724483084300.jpg"
                            ], 
                            "__v" : 0, 
                            "_id" : "594c9007dfc12c1000a673f2"
                        }, 
                        {
                            "created" : "2017-06-23T03:49:52.874Z", 
                            "upc" : "630509318292", 
                            "ean" : "0630509318292", 
                            "title" : "Marvel Legends Infinite Series Marvel's Scarlet Spider", 
                            "brand" : "Hasbro", 
                            "model" : "B1989AS00", 
                            "description" : "Cloned to destroy Peter Parker, Ben Reilly chose instead to fight alongside Spider-Man as Scarlet Spider! <br /><br />Collect to build Marvel's Rhino! This Marvel's Scarlet Spider figure is part of a Marvel Legends Build-A-Figure collection that also includes Marvel's White Tiger, Misty Knight, Ghost Rider, Superior Venom, Kraven, and Marvel's Chameleon. Each 6-inch scale figure features detailed deco, is easily poseable with many points of articulation, and includes a Build-A-Figure component. When you co...", 
                            "color" : "Multi", 
                            "size" : "", 
                            "dimensions" : "", 
                            "weight" : "", 
                            "images" : [
                                "http://8016235491c6828f9cae-6b0d87410f7cc1525cc32b79408788c4.r96.cf2.rackcdn.com/1752/85537933_1.jpg", 
                                "https://i5.walmartimages.com/asr/bcfd904f-b6aa-4f8c-8866-7bce2e33f110_1.9ba4118624628d8c437931c242859df4.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff", 
                                "http://img1.r10.io/PIC/93814855/0/1/250/93814855.jpg", 
                                "http://c.shld.net/rpx/i/s/i/spin/10030910/prod_1471742612", 
                                "http://c.shld.net/rpx/i/s/i/spin/10030910/prod_1471742612", 
                                "http://images10.newegg.com/ProductImageCompressAll200/A3G6_1_2016091636321469.jpg", 
                                "http://c.shld.net/rpx/i/s/i/spin/10030910/prod_1471742612"
                            ], 
                            "v" : 0,
                            "_id" : "594c8fe0dfc12c1000a673f1"
                        }
                    ], 
                    "created" : "2017-06-27T01:10:31.429+0000", 
                    "__v" : 0
                }
            },
            data: {
                //roles: ['user', 'admin']
            }
        })
        .state('confirmreturn', {
            url: '/confirmreturn',
            params: {
                confirmReturn: null
            },            
            templateUrl: 'modules/returns/client/views/returns.client.confirmReturnView.html',
            controller: 'confirmController',
            data: {
                //roles: ['user', 'admin']
            }
        });
    }
]);
