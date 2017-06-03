const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const server = express()
    .use(express.static(`${__dirname}/public`))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

let chatContent = [];

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify(chatContent));

    ws.on('message', msg => {
        const data = JSON.parse(msg);

        chatContent.push(data);

        wss.clients.forEach(client => {
            client.send(JSON.stringify(data));
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});