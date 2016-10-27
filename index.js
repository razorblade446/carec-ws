const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3232;

app.use(cors());

app.use(express.static('public'));
app.post('/chat', (req, res) => {
    res.redirect(`/chat`);
});

require('./Signaling-Server.js')(server, function(socket) {
    try {
        var params = socket.handshake.query;

        // "socket" object is totally in your own hands!
        // do whatever you want!

        // in your HTML page, you can access socket as following:
        // connection.socketCustomEvent = 'custom-message';
        // var socket = connection.getSocket();
        // socket.emit(connection.socketCustomEvent, { test: true });

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

server.listen(PORT, () => console.log(`chat-snap is listening on port ${PORT}`));
