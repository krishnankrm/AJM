const config = require('../../Configuration Files/config.json')
const jwt = require('jsonwebtoken');
const url = config.mongoclienturl
var APisecretkey='AJM_Mixer_JWT'
var MongoClient = require('mongodb').MongoClient;
var CryptoJS = require("crypto-js");
var ApiError=require('../error/ApiError')
var usersdb=[]

module.exports = {
    authenticate,
};

async function authenticate(body,next ) {

  let dateTime = new Date();
  let secretKey = "*$"+dateTime.getDate()+"-"+dateTime.getMonth()+"-"+"@ISL_AJM#$"+"-"+dateTime.getFullYear()+"**"

  var bytes = CryptoJS.AES.decrypt(body.encryptedJSON, secretKey);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  var query={username:decryptedData.username, password:decryptedData.password}
  let d100=new Promise(async function(myResolve, myReject) {
    MongoClient.connect(url, async function(err, db) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("AJM");
    dbo.collection("Login").find(query).toArray(function(err, result) {
      if (err) throw err;
      usersdb=result;
      myResolve(usersdb)
      db.close();
    });
 });
})})

 let d= await d100
 const user = usersdb.find(u => u.username === decryptedData.username && u.password === decryptedData.password);

if (!user)    {                                
  next(ApiError.UnAuthorizedRequest()); 
}

const token = jwt.sign({ sub: user['username'] }, APisecretkey, { expiresIn: '7d' });
return {
    "token":token,
}}



