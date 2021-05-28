//MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('tcp://192.168.1.99:1883')
var topic = 'sensor'
var message = 2

client.on('connect', ()=>{
    setInterval(()=>{
        message=message+2
        var string = message.toString()
        client.publish(topic,string)
        console.log('Message sent', string)
    }, 1000)
})