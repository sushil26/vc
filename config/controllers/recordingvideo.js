var db = require('../dbConfig.js').getDb();
var fs = require('fs');
const path = require('path');
const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app directory
var gridfs = require('mongoose-gridfs')({
    collection:'attachments',
    model:'Attachment',
    mongooseConnection: db
  });

//obtain a model
Attachment = gridfs.model;

//create or save a file
Attachment.write({
    filename:'sample.txt', 
    contentType:'text/plain'
    }, 
    fs.createReadStream(ABSPATH + '/public/Recording/sampleVidep.mpg'), 
    function(error, createdFile){
      console.log("createdFile: "+createdFile);
      console.log("createdFile: "+JSON.stringify(createdFile));
  });