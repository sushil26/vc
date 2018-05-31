
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';

exports.encrypt = function (text) {
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}
exports.decrypt = function (text) {
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}
exports.emptyCheck = function (value) {
  if ((value == '') || (value == null)) {
    return false;
  } else {
    return true;
  }
}

exports.createdDate = function () {
  var date = new Date();
  // var createdDate = date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  var createdDate = date.getDate() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return createdDate;
  
}

exports.date = function(){
  var date = new Date();

  todayDate = date.getFullYear() + "_" + (parseInt(date.getMonth()) + 1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();

  return todayDate;
}