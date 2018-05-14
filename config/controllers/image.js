var multer = require('multer');

var fileStorage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        console.log("storage");
        cb(null, './public/fileStorage')
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg|PNG|JPEG|JPG)$/)) 
        {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        }
        else {
            var fileFullPath = file.originalname + '-' + Date.now() + '.jpg';
            console.log("fileFullPath: " + fileFullPath);
           
            cb(null, fileFullPath)
            
           

            
        }
    }
});
var uploadAttendance = multer({ storage: fileStorage, limits: {fileSize:1000000} }).single('img');

/* ##### End upload file  ##### */





module.exports.uploadAttendance = function (req, res) {
    console.log("uploadAttendance-->");
    var responseData;
  
    uploadAttendance(req, res, function (err) {
        console.log("req.myProfPic: " + req.img);
        console.log("req.file: " + req.file);
        // console.log("req.files: " + req.files);
        // console.log("req.file.originalname: "+req.file.originalname);

        if (err) {
            console.log("errrr: imageUpload.js "+err);
            if(err.code === 'LIMIT_FILE_SIZE')
            {
                res.json({success:false, message:'File size is too large, max limit is 10MB'});
            }
            else if(err.code === 'filetype')
            {
                res.json({success:false, message:'File type is invalid, must be match with jpg/jpeg/png'});
            }  
            else
            {
                console.log(err);
                res.json({success:false, message:'File was not able to upload'});
            }  
           
        }
        else {
            console.log("req.file: "+req.file);
            if(!req.file)
                {
                    res.json({success:true, message:'No file was selected'});
                }
                else{
                    // console.log("*path: "+req.file.path);
                    // console.log("*filename: "+req.file.filename);
                    // console.log("*destination: "+req.file.destination);
                    var uploadProfPicPath = "festivalDetail/"+req.file.filename;
                    // console.log("uploadProfPicPath: "+uploadProfPicPath);
                    res.json({success:true, message:'File was uploaded',fileFullPath: uploadProfPicPath});
                }
           



        }

    })


    
    console.log("<--uploadAttendance");
}