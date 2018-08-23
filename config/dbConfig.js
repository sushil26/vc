// var MongoClient = require( 'mongodb' ).MongoClient;
var mongoose = require('mongoose');
var GridFsStorage = require('multer-gridfs-storage');
var _db;
module.exports = {
  connectToServer: function( callback ) {
    mongoose.connect('mongodb://localhost/vc', function(err, db){
      // storage = new GridFSStorage({ db: promise });
    // MongoClient.connect( "mongodb://127.0.0.1:8080/vc", function(err,db) {
      console.log("connecting to VC");
      console.log("db: "+db);
     
      _db = db;
     return callback(err);
    });
  },
  getDb: function() {
    return _db;
  }
};
