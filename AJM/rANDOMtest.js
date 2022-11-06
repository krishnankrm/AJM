const { ObjectID } = require('bson');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";



MongoClient.connect(url,(err,db)=>{
    if(!err)
       { var db0 = db.db("AJM");

        db0.collection('Energy').aggregate([
            {
                $bucket: {
                  groupBy: "$time",                        // Field to group by
                  boundaries: [ {$dateFromString:{dateString:'2022-09-26T10:38:14.774+00:00'}}, {$dateFromString:{dateString:'2022-09-27T10:38:14.774+00:00'}},{$dateFromString:{dateString:'2022-09-28T10:38:14.774+00:00'}} ], // Boundaries for the buckets
                  default: "Other",                             // Bucket id for documents which do not fall into a bucket8
                  output: {                                     // Output for each bucket
                    "MaxEnergy": { $max:"$Energy"},
            
                }}}
            // {$match:{ time:{$gte:"$stoptime"}}}
           
        ]).toArray((err,result)=>{
            console.log(result)
            console.log(err)
                   })
}
})