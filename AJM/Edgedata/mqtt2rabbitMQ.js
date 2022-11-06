

var amqp = require('amqplib/callback_api');
var ConfigFile=require('../Configuration Files/config.json')
const mqtt = require('mqtt');
const { json } = require('express/lib/response');

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

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'RabbitMQ-ISL43111';
    var msg = payload.toString();
    d = new Date();

    msg=msg.slice(0,-1)+`,"topic":"${topic}","time":"${d.toUTCString()}"}`
    console.log(msg)

    channel.assertQueue(queue, {
      durable: true
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
  });
})
})