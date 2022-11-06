var amqp = require('amqplib/callback_api');
var MongoClient = require('mongodb').MongoClient;

var ConfigFile=require('../Configuration Files/config.json')
var mongoclienturl = ConfigFile.mongoclienturl;
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'RabbitMQ-ISL43111';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    channel.consume(queue, function(msg) {

      var RabbitMQMsg=JSON.parse(msg.content.toString())
      console.log(RabbitMQMsg)

      var collectionName=RabbitMQMsg["topic"].charAt(0).toUpperCase() + RabbitMQMsg["topic"].slice(1)
      var dateRecieved=new Date(RabbitMQMsg.time)
      dateRecieved.setHours(dateRecieved.getHours()+5)
      dateRecieved.setMinutes(dateRecieved.getMinutes()+30)
      RabbitMQMsg.time=dateRecieved
    if( RabbitMQMsg["topic"]=='rpm1' || RabbitMQMsg["topic"]=='rpm2')
    { 
      MongoClient.connect(mongoclienturl, function(err,  db) {
        var dbo = db.db("AJM");
        delete RabbitMQMsg.topic;

            dbo.collection(collectionName).insertOne(RabbitMQMsg, function(err, res) {
                if (err)  channel.ack(msg);
                else
               { if(res.acknowledged==true)     
                  {console.log(" [x] Done");
                  channel.ack(msg);
                }
                else
                  {console.log('Error in writing in DB' )
                  channel.ack(msg);}}
            });
          });
    }
    else if(RabbitMQMsg["topic"]=='energy')
    { 
      MongoClient.connect(mongoclienturl, function(err,  db) {
        var dbo = db.db("AJM");
        delete RabbitMQMsg.topic;
        dbo.collection(collectionName).aggregate([{$match:{machineId:RabbitMQMsg.machineId}},{$sort:{time:-1}},{$limit:1}]).toArray()
        .then((result,err)=>{
            if(!err)
            {
                if(result.length==0)
            {  
                myobj22={...RabbitMQMsg ,diff:0}
                dbo.collection(collectionName).insertOne(myobj22)
                .then((res)=>{
                  if(res.acknowledged==true)     
                  {console.log(" [x] Done");
                   channel.ack(msg);
                  }
                else
                  {console.log('Error in writing in DB' )
                  channel.ack(msg);
                }
              })
                .catch((err)=>console.log('err',err,'err'))

            }
            else
            {  
              myobj22={...RabbitMQMsg ,diff:parseFloat((RabbitMQMsg.Energy-result[0]["Energy"]).toFixed(2))}

                dbo.collection(collectionName).insertOne(myobj22)
                .then((res)=>{
                  if(res.acknowledged==true)     
                  {console.log(" [x] Done");
                   channel.ack(msg);
                  }
                else
                  {console.log('Error in writing in DB' )
                  channel.ack(msg);
                }
              })
                .catch((err)=>console.log('err',err,'err'))
            }

      }})
    })}
    else
    {
      MongoClient.connect(mongoclienturl, function(err,  db) {
        var dbo = db.db("AJM");
        delete RabbitMQMsg.topic;
      if(RabbitMQMsg.status==true)
      {

          dbo.collection(collectionName).aggregate([{$match:{machineId:RabbitMQMsg.machineId}},{$sort:{time:-1}},{$limit:1}]).toArray()
          .then((result,err)=>{
              if(!err)
              {
                  if(result.length==0)
              {  
                  myobj22={time:RabbitMQMsg.time ,cycleCount:1,stoptime:'',machineId:RabbitMQMsg.machineId}
                  dbo.collection(collectionName).insertOne(myobj22)
                  .then((res)=>{
                    if(res.acknowledged==true)     
                    {console.log(" [x] Done");
                     channel.ack(msg);
                    }
                  else
                    {console.log('Error in writing in DB' )
                    channel.ack(msg);
                  }
                })
                  .catch((err)=>console.log('err',err,'err'))

              }
              else if(result[0].stoptime!='')
              {  
                  myobj22={time: RabbitMQMsg.time,cycleCount:result[0].cycleCount+1,stoptime:'',machineId:RabbitMQMsg.machineId}
                  dbo.collection(collectionName).insertOne(myobj22)
                  .then((res)=>{
                    if(res.acknowledged==true)     
                    {console.log(" [x] Done");
                     channel.ack(msg);
                    }
                  else
                    {console.log('Error in writing in DB' )
                    channel.ack(msg);
                  }
                })
                  .catch((err)=>console.log('err',err,'err'))
              }
              else if(result[0].stoptime=='')
              {   
                  myobj22={_id:result[0]._id}
                  newSet={$set:{time: RabbitMQMsg.time}}
                  dbo.collection(collectionName).updateOne(myobj22,newSet)
                  .then((res)=>{
                    if(res.acknowledged==true)     
                    {console.log(" [x] Done");
                     channel.ack(msg);
                    }
                  else
                    {console.log('Error in writing in DB' )
                    channel.ack(msg);
                  }
                })
                  .catch((err)=>console.log('err',err,'err'))

              }
          }
         else
         channel.ack(msg);
          })
      }
      else if(RabbitMQMsg.status==false)
      {
          dbo.collection(collectionName).aggregate([{$match:{machineId:RabbitMQMsg.machineId}},{$sort:{time:-1}},{$limit:1}]).toArray()
          .then((result,err)=>{
              if(!err)
              {
                  if(result.length!=0)
           {  if(result[0].stoptime=='')
              {   
                myobj22={_id:result[0]._id}
                newSet={$set:{stoptime: RabbitMQMsg.time}}
                  dbo.collection(collectionName).updateOne(myobj22,newSet)
                  .then((res)=>{
                    if(res.acknowledged==true)     
                    {console.log(" [x] Done");
                     channel.ack(msg);
                    }
                  else
                    {console.log('Error in writing in DB' )
                    channel.ack(msg);
                  }
                })
                  .catch((err)=> 
                  {console.log('Error in writing in DB' )
                  channel.ack(msg)
                })

              }
              else
              channel.ack(msg);    }
              else
          channel.ack(msg);    
          }    
          else
          channel.ack(msg);          
          })

        }
      })
    }

    }, {
      noAck: false
    });
  });
});
