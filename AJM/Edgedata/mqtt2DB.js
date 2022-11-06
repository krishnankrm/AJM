var MongoClient = require('mongodb').MongoClient;

var ConfigFile=require('../Configuration Files/config.json')
var mongoclienturl = ConfigFile.mongoclienturl;
const mqtt = require('mqtt');
const { json } = require('express/lib/response');
var mongoclienturl = ConfigFile.mongoclienturl;
var Mqttclient  = mqtt.connect(`mqtt://${ConfigFile.mqttip}`,
 {  
     username: ConfigFile.mqtt_username,
     password:  ConfigFile.mqtt_password,
     keepalive: 60,
     reconnectPeriod: 1000,  
 } );


 Mqttclient.on("connect",function(hu,err){
    if(err) console.log(err)    
    console.log("connected");
    Mqttclient.subscribe(['rpm1','rpm2','hatch','lever','energy','mixerStatus']);
})



Mqttclient.on('message', (topic, payload) => {       
MongoClient.connect(mongoclienturl, function(err,  db) {
    if(!err){
    var dbo = db.db("AJM");
    var collectionName=topic.charAt(0).toUpperCase() + topic.slice(1)
    myobj=JSON.parse(payload.toString())
    var date=new Date()
    var myobj22={}
    if(topic=='energy' || topic=='rpm1' || topic=='rpm2')
        { 
                
                myobj.time=  new Date(date.setTime(date.getTime() + (330*60*1000)));

                dbo.collection(collectionName).insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
        }
        else
        {
            var collectionName=topic.charAt(0).toUpperCase() + topic.slice(1)

            if(myobj.status==true)
            {
                dbo.collection(collectionName).aggregate([{$sort:{time:-1}},{$limit:1}]).toArray()
                .then((result,err)=>{
                    if(!err)
                    {
                        if(result.length==0)
                    {  
                        myobj22={time: new Date(date.setTime(date.getTime() + (330*60*1000))),cycleCount:1,stoptime:''}
                        dbo.collection(collectionName).insertOne(myobj22)
                        .then()
                        .catch((err)=>console.log('err',err,'err'))

                    }
                    else if(result[0].stoptime!='')
                    {  
                        myobj22={time: new Date(date.setTime(date.getTime() + (330*60*1000))),cycleCount:result[0].cycleCount+1,stoptime:''}
                        dbo.collection(collectionName).insertOne(myobj22)
                        .then()
                        .catch((err)=>console.log('err',err,'err'))
                    }
                    else if(result[0].stoptime=='')
                    {   
                        myobj22={_id:result[0]._id}
                        newSet={$set:{time: new Date(date.setTime(date.getTime() + (330*60*1000)))}}
                        dbo.collection(collectionName).updateOne(myobj22,newSet)
                        .then()
                        .catch((err)=>console.log('err',err,'err'))
                    }
                }
               
                })
            }
            else if(myobj.status==false)
            {
                dbo.collection(collectionName).aggregate([{$sort:{time:-1}},{$limit:1}]).toArray()
                .then((result,err)=>{
                    if(!err)
                    {
                        if(result.length!=0)
                 {  if(result[0].stoptime=='')
                    {   
                        myobj22={cycleCount:result[0].cycleCount}
                        newSet={$set:{stoptime: new Date(date.setTime(date.getTime() + (330*60*1000)))}}
                        dbo.collection(collectionName).updateOne(myobj22,newSet)
                        .then()
                        .catch((err)=>console.log('err',err,'err'))
                    }}
                }
               
                })
            }
        }      
 }
 else
    {
        console.log(err)
    }
    })    
  })