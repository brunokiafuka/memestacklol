const express = require('express');
const server = require('http').createServer();

const app = express();

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app)
server.listen(3000, () => {
    console.log('listening on port 3000');
})


/* WEBSOCKET */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;

    console.log('clients connected: ', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('welcome!');
    }

    ws.on('close', function close() {
        wss.broadcast(`Current visitors: ${wss.clients.size}`);
        console.log('A client has disconnected');
    });

    ws.on('error', function error() {
        //
    });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
    console.log('Broadcasting: ', data);
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
