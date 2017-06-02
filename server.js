const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const aWss = expressWs.getWss('/');

let chatContent = [];

app.ws('/', socket => {
    socket.send(JSON.stringify(chatContent));

    socket.on('close', cn => console.log('closed'));

    socket.on('message', msg => {
        const data = JSON.parse(msg);

        chatContent.push(data);
        aWss.clients.forEach(client => {
            client.send(JSON.stringify(data));
        });
    });
});

app.use(express.static('public'));

app.listen(3667, () => console.log('app listened on 3667'));