const mqtt = require('mqtt')
var ConfigFile=require('../Configuration Files/config.json')

var client  = mqtt.connect(`mqtt://${ConfigFile.mqttip}`,
 {  
     username: ConfigFile.mqtt_username,
     password:  ConfigFile.mqtt_password,
     keepalive: 60,
     reconnectPeriod: 1000,  
 } );
 
var hatchbool=true,leverbool=false,mixerbool=true
var Energy=102

 function rpm1()
 {
    client.publish('rpm1',JSON.stringify({val:Math.floor(Math.random() * 200), machineId:'KP2PNYPRDMIX001' }))
 }
 function rpm2()
 {
    client.publish('rpm2',JSON.stringify({val:Math.floor(Math.random() * 200), machineId:'KP2PNYPRDMIX001' }))
 
 }
 function hatch()
 {
   hatchbool=Math.random() < 0.5;

    client.publish('hatch',JSON.stringify({status:hatchbool, machineId:'KP2PNYPRDMIX001'}) )
 }

 function lever()
 {
    leverbool=Math.random() < 0.5;
    client.publish('lever',JSON.stringify({status:leverbool, machineId:'KP2PNYPRDMIX001' }))
   }


 function energy()
 {
   Energy=parseFloat(Energy+0.01).toFixed(2)
   client.publish('energy',JSON.stringify({Energy:parseFloat(Energy).toFixed(2) ,Power:parseFloat((Math.random() * 10000).toFixed(2)),PowerFactor:parseFloat(Math.random().toFixed(2)), machineId:'KP2PNYPRDMIX001' }))
 }

 function MixerOnStatus()
 {
   mixerbool=!mixerbool
   client.publish('mixerStatus',JSON.stringify({status:leverbool , machineId:'KP2PNYPRDMIX001'}))
   }

 client.on("connect",function(hu,err){
     if(err) console.log(err)    
     console.log("connected");
     client.subscribe(['rpm1','rpm2','hatch','lever','energy','mixerStatus']);
     rpm1()
     rpm2()
     hatch()
     energy()
     lever()
     MixerOnStatus()
     setInterval(() => {
        rpm1()
        rpm2()
        hatch()
        lever()
        energy()
        MixerOnStatus()

     }, 4000);
 })


 client.on('message', (topic, payload) => {
      console.log(topic,payload.toString())
   })