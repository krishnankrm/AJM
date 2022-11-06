var MongoClient = require('mongodb').MongoClient;
var ConfigFile=require('../Configuration Files/config.json')

var mongoclienturl = ConfigFile.mongoclienturl;

MongoClient.connect(mongoclienturl, function(err,  db) {
    
    if (err) console.log('Database Connected Error',err);
    else    console.log("Database Connected!");
    var dbo = db.db("AJM");
    dbo.listCollections().toArray()
    .then(cols =>{ if(cols.length<7){
        var collectionList = ["Rpm1", "Rpm2","Energy","Hatch","Login","Lever","MixerStatus"];
        collectionList.forEach(function(collectionName) {
            dbo.createCollection(collectionName)
            .then((a)=>{console.log('Created Collection '+collectionName)
            if(collectionName=='Login') 
                dbo.collection(collectionName).insertOne({username:'admin',password:'admin'})
            else
                dbo.collection(collectionName).createIndex({'time':-1})
        })
            .catch((err)=>{console.log('Collection Create Error '+collectionName)})
        })

        
    }
    else
    {
        console.log(`DB already has ${cols.length} collections`)
        db.close()

    }})

  })