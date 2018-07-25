let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);
io.origins('*:*');

io.on('connection', (socket) =>{
    socket.on('disconnect', function(){
        io.emit('user-changed', {user: socket.pradoname, event: 'left'});
    });

    socket.on('set-pradoname', (pradoname) =>{
        socket.pradoname = pradoname;
        io.emit('user-changed', {user: socket.pradoname, event: 'joined'});
    });

    socket.on('add-message', (message) =>{
        io.emit('message', {text: message.text, from: socket.pradoname, created: new Date()});
    });
});

let port = process.env.port ||3001;

server.listen(port, function(){
        console.log(port);
});
