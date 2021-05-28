//MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('tcp://192.168.1.99:1883')
var topic = 'aloalo'
var number = 1;
var from = 'from node 1'

client.on('connect', ()=>{
    setInterval(()=>{
        number++;
        var string = from +': '+ number.toString() 
        client.publish(topic,string)
        console.log('Message sent', string)
    }, 500)
})