const ws = new WebSocket('ws://localhost:3667');
const form = document.querySelector('form');
const input = document.querySelector('input');
const chat = document.querySelector('.chat');
const USER_ID = +new Date();

ws.onopen = () => {
    form.onsubmit = e => {
        e.preventDefault();
        let data = {
            id: USER_ID,
            msg: input.value
        };

        ws.send(JSON.stringify(data));
    }
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