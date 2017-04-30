/**
 * Created by gerard on 19/04/17.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var HashMapKeys = new Array();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    console.log('User connected with socketID: ' + socket.id);

    socket.on('publicKey', function(user, publicKey) {
		savePublicKey(user, publicKey);
    });

    socket.on('getKey', function(user) {
		socket.emit('getKeyServer', {publicKeyOther: sendKey(user)});
    });

    socket.on('message', function(name, body, key, mode) {

	if(mode === "symmetric") {
		console.log("name: ", name, "body", body, "key", key, "mode", mode);
		console.log("");
        socket.broadcast.emit('messageServer', {user: name, message: body, key: key});
	}
	else {
		console.log("name: ", name, "body", body, "key", key, "mode", mode);
		console.log("");
        socket.broadcast.emit('messageServer', {user: name, messageRSA: body});
	}
	

    });

    socket.on('disconnect', function() {
        console.log('User disconnected with socketID: ' + socket.id);
    });

});

http.listen(30002, function(){
    console.log('Server listening on port 30002');
});


function savePublicKey(u, k) {
	HashMapKeys.push({name: u, key: k});
	HashMapKeys.forEach(function(a, i) {
		console.log("HashMapKeys: " + i, a);
		console.log("");
	});
}

function sendKey(name) {
	console.log("sendKey" ,HashMapKeys.filter(function(h) {return h.name != name}));
	console.log("");
	var otherKey = HashMapKeys.filter(function(h) {return h.name != name});
	return otherKey[0].key;
}


