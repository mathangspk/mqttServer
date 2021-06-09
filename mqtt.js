var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
var Topic = '#'; //subscribe to all topics
var Broker_URL = 'mqtt://128.199.82.173';
var moment = require('moment')
var genRandomString = "MQTT-" + genRandom(5);
var options = {
	clientId: genRandomString,
	port: 1883,
	//username: 'mqtt_user',
	//password: 'mqtt_password',	
	keepalive: 60
};

var mongo = require('mongodb')
var mongoc = mongo.MongoClient
var url = 'mongodb://mqtt:!mqtt@128.199.82.173:27017/mqttJS'

var client = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
	//console.log("Connecting MQTT");
	client.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
	console.log("Subscribed to " + Topic);
	if (err) { console.log(err); }
};

function mqtt_reconnect(err) {
	//console.log("Reconnect MQTT");
	//if (err) {console.log(err);}
	client = mqtt.connect(Broker_URL, options);
};

function mqtt_error(err) {
	//console.log("Error!");
	//if (err) {console.log(err);}
};

function after_publish() {
	//do nothing
};

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {
	console.log(topic)
	console.log(packet.payload.toString())
	let stringRec = packet.payload.toString().split("-");
	// let volt = stringRec[0];
	// let current = stringRec[1];
	// let power = stringRec[2];
	// let energy = stringRec[3];
	// let frequency = stringRec[4];
	// let powerfactor = stringRec[5];
	let volt = Number(stringRec[0]);
	console.log(volt)
	let current = Number(stringRec[1]);
	let power = Number(stringRec[2]);
	let energy = Number(stringRec[3]);
	let frequency = Number(stringRec[4]);
	let powerfactor = Number(stringRec[5]);
	let topicInfo = topic.split("-")
	//let collection = topicInfo[1]+topicInfo[2]
	mongoc.connect(url, (error, client) => {

		var myCol = client.db('mqttJS').collection('mqtts')
		if (volt && current && power && energy && frequency && powerfactor) {
			myCol.insertOne({
				topic,
				volt,
				current,
				power,
				energy,
				frequency,
				powerfactor,
				date: new Date()
			}, () => {
				//console.log('Data is saved to mongoDB')
				client.close()
			})
		}
	})
};

function mqtt_close() {
	console.log("Close MQTT");
};

function genRandom(numBytes) {
	let i = 0;
	let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	let randString = "";
	for (i = 0; i < numBytes; i++) {
		randString = randString + random_item(letters);
	}
	return randString;
}
function random_item(items) {

	return items[Math.floor(Math.random() * items.length)];

}