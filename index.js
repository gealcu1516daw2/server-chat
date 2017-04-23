/**
 * Created by gerard on 19/04/17.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('User connected with socketID: ' + socket.id);

    // socket.on('message', function(name, body) {
    socket.on('message', function(name, body) {
        //socket.emit('message', {user: name, message: body});
        console.log(name, body);
        var sockets = io.sockets.sockets;

        console.log(sockets instanceof Array);
        
        sockets.forEach(function(s) {
            if(s.id != socket.id) {
                socket.emit('message', {user: name, message: body});
            }
        })

    });

    socket.on('disconnect', function() {
        console.log('User disconnected with socketID: ' + socket.id);
    });
});

http.listen(30002, function(){
    console.log('Server listening on port 30002');
});