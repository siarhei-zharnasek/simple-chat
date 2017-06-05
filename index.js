const express = require('express');
const SocketServer = require('ws').Server;
const translate = require('node-google-translate-skidz');

const PORT = process.env.PORT || 3000;
const server = express()
    .use(express.static(`${__dirname}/public`))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

const sendMsgs = data => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(data));
    });
};

let chatContent = [];

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify(chatContent));

    ws.on('message', msg => {
        let data = JSON.parse(msg);

        if (data.enableTranslate) {
            translate({
                text: data.msg,
                source: 'en',
                target: 'ru'
            }, res => {
                data.msg = res.translation;
                sendMsgs(data);
            });
        } else {
            sendMsgs(data);
        }

        chatContent.push(data);
    });

    ws.on('close', () => console.log('Client disconnected'));
});