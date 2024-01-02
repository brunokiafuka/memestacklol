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

process.on('SIGINT', () => {
    wss.clients.forEach((client) => {
        client.close();
    });

    server.close(() => {
        shutdownDB();
    });
});


/* WEBSOCKET */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;

    console.log('clients connected: ', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);

    db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))`);

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


/* SQLite */
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:'); // saving the db in memory resets each time server is restarted

// .serialize ensures DB is set up before any queries
db.serialize(() => {
    db.run(`CREATE TABLE visitors (
      count INTEGER,
      time TEXT
      )`);
});

function getCounts() {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    });
}

function shutdownDB() {
    getCounts();
    console.log('shutting down DB');
    db.close();
}
