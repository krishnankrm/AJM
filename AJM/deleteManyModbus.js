var MongoClient = require('mongodb').MongoClient;

var ConfigFile=require('./Configuration Files/config.json')
var mongoclienturl = ConfigFile.mongoclienturl;

MongoClient.connect(mongoclienturl, function(err,  db) {
    if(!err){
    var dbo = db.db("AJM");
    var myobj={stoptime:""}
    var collectionName='Lever'
    dbo.collection(collectionName).deleteMany(myobj, function(err, res) {
        if (err) throw err;
        console.log(res)
        db.close();
    });

    }
})
