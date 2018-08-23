//var db = require("../dbConfig.js").getDb();
var general = require("../general.js");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vc');
var conn = mongoose.connection;
var Grid = require('gridfs-stream');
const path = require('path');
var fs = require('fs');
Grid.mongo = mongoose.mongo;
//Grid.mongo = mongoose.mongo;

// Grid.collection("upload");
const chatFileDirectory = process.cwd() + '/public/chatFiles/';

module.exports.chatFileUpload = function (req, res) {
    console.log("chatFileUpload-->");
    if (!req.files) {
        // console.log("req.files.img: " + req.files.img);
        //console.log("req.file.img: " + req.file.img);
        return res.status(400).send('No files were uploaded.');
    }
    else {
        console.log("req.files.sampleFile: " + JSON.stringify(req.files.img));
        let myFile = req.files.img;
        
        console.log("path--" + chatFileDirectory);
        var fileArr = myFile.name.split(".");
        var fileName = "";
        for (var i = 0; i < fileArr.length - 1; i++) {
            fileName = fileName + fileArr[i]
        }
        fileName = fileName + "_" + general.date() + "." + fileArr[fileArr.length - 1];
        console.log("fileName--" + fileName)

        myFile.mv(chatFileDirectory + fileName, function (err) {
            if (err) {
                console.log(require('util').inspect(err));
                var responseData = {
                    "status": true,
                    "message": "date stored unsuccessfully",
                    "data": { "err": err }
                }
                res.status(500).send(responseData);
            }
            else {
                console.log("uploaded successfully into directory");
                var gfs = Grid(conn.db);
                var writeStream = gfs.createWriteStream({
                    filename: fileName
                });

                var response = fs.createReadStream(chatFileDirectory + fileName).pipe(writeStream);
                var lastInsertedFileId = response._store.fileId;
                console.log("lastInsertedFileId: " + lastInsertedFileId);

                writeStream.on('close', function (file) {
                    console.log(file.filename + "written to db");
                    var responseData;
                    var setData = {
                        "vcRecordId": lastInsertedFileId
                    }

                    responseData = {
                        status: true,
                        errorCode: 200,
                        message: "insert Successfull and Failed to send mail",
                        data: lastInsertedFileId
                    };
                    res.status(200).send(responseData);
                })
                // var responseData = {
                //     "status": true,
                //     "message": "date stored successfully",
                //     "data": { "filePath": "/schoolLogo/" + fileName }
                // }
                // res.status(200).send(responseData);
            }
        });


    }


    // var userDataFile = req.files.img;

    // var chatFile = req.files.img
    // console.log("chatFile: " + JSON.stringify(chatFile));


    console.log("<--recordVideo");
}

module.exports.getChatFileUpload = function (req, res) {
    console.log("getChatFileUpload-->");
    console.log("req.params.id: " + req.params.id);

    var gfs = Grid(conn.db);
    var output = '';
    //var vals ='';
    //  res.set(200, {'Content-Type': 'image/jpeg'});
    var readStream = gfs.createReadStream({
        "_id": req.params.id // this id was stored in db when inserted a video stream above
    });
    readStream.on("data", function (chunk) {
        // console.log("chunk: " + JSON.stringify(chunk));
        // console.log("chunk.data: " + chunk.data);
        output += chunk.data;
        vals = (new Buffer(chunk)).toString('base64')
       // console.log("vals: " + JSON.stringify(vals));
    });
    // base64.decode(output, function (err, output) {
    //     console.log('output');
    //     // dump contents to console when complete

    // });
    readStream.on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
    });

    readStream.on("end", function () {
        console.log("Final Output");
       // console.log("vals: " + JSON.stringify(vals));
        // console.log("res: "+res[1].dbgileName.bufer,'binary');
        // readStream.pipe(res);
        responseData = {
            status: true,
            message: "get file successful",
            data: "data:image/jpg;base64," + vals
        };
        //readStream.pipe(responseData);
        res.status(200).send(responseData);
        console.log("responseData: " + JSON.stringify(responseData));

    });

    console.log("<--getRecordVideo");
}


/* ##### Start Multer  ##### */
/** Setting up storage using multer-gridfs-storage */
// var storage = GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 const filename = buf.toString('hex') + path.extname(file.img.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     metadata: req.body
//                 };
//                 resolve(fileInfo);
//             });
//         });
//     }
// });

// var cfUpload = multer({ //multer settings for single upload
//     storage: storage
// }).single('file');
/** API path that will upload the files */
// module.exports.chatFileUpload = function (req, res) {
//     console.log("chatFileUpload-->");
//     console.log("req.file: " + req.file);
//     console.log("req.files: " + req.files);
//     console.log("gfs: " + gfs);

//     cfUpload(req, res, function (err) {
//         console.log("cfUpload from storage");
//         console.log("req.filename: " + res.filename);
//         //console.log("req.originalname: "+res.file.originalname);
//         if (err) {
//             res.json({ error_code: 1, err_desc: err });
//             return;
//         }
//         res.json({ error_code: 0, err_desc: null });
//     });
// };
// module.exports.getChatFileUpload = function (req, res) {
//     var gfs = Grid(db);
//     gfs.collection('cfFiles'); //set collection name to lookup into

//     /** First check if file exists */
//     gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 responseCode: 1,
//                 responseMessage: "error"
//             });
//         }
//         /** create read stream */
//         var readstream = gfs.createReadStream({
//             filename: files[0].filename
//         });
//         /** set the proper content type */
//         res.set('Content-Type', files[0].contentType)
//         /** return response */
//         return readstream.pipe(res);
//     });
// };
/* ##### End Multer  ##### */