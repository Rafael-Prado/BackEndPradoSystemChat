let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


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
        console.log('listening in http://localhost:' + port);
});
