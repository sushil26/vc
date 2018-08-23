var express = require('express');
var http = require('http');
var bodyParser = require('body-parser')

var nodemailer = require('nodemailer');
var fs = require('fs'),
url = require('url'),
path = require('path');
var multer = require('multer');

module.exports = function(app, config) {
	//app.set('view engine','html');
	app.use(bodyParser.urlencoded({extended:true}));

	// app.use(session({secret: "Your secret key"}));
	//app.use(multer({ dest: './config'}));
	// app.use(multer({dest:'./public/schoolLogo/'}).single('file'));
	app.use(bodyParser.json({
		limit: '100mb'
	}));
}
