const HOST = location.origin.replace(/^http/, 'ws');
const ws = new WebSocket(HOST);
const form = document.querySelector('form');
const input = document.querySelector('.input-text');
const checkbox = document.querySelector('.input-translate');
const chat = document.querySelector('.chat');
const USER_ID = +new Date();
const recognition = new webkitSpeechRecognition();

recognition.onresult = event => {
    let data = {
        id: USER_ID,
        msg: event.results[0][0].transcript,
        enableTranslate: checkbox.checked
    };

    ws.send(JSON.stringify(data));
};

recognition.onend = () => {
    recognition.start();
};

ws.onopen = () => {
    recognition.start();

    form.onsubmit = e => {
        e.preventDefault();
        let data = {
            id: USER_ID,
            msg: input.value,
            enableTranslate: checkbox.checked
        };

        ws.send(JSON.stringify(data));
    };
};

ws.onmessage = msg => {
    const response = JSON.parse(msg.data);

    if (response.length) {
        response.forEach(item => {
            if (item.id === USER_ID) {
                chat.innerHTML += `<p>YOU: ${item.msg}</p>`;
            } else {
                chat.innerHTML += `<p>${item.id}: ${item.msg}</p>`;
            }
        });
    } else if (response.id) {
        if (response.id === USER_ID) {
            chat.innerHTML += `<p>YOU: ${response.msg}</p>`;
        } else {
            chat.innerHTML += `<p>${response.id}: ${response.msg}</p>`;
        }
    }

    input.value = '';
};