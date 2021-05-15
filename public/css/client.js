const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');
do {
    name = prompt('Please enter your name : ')
}while(!name);
if(name){
    let j = document.createElement('h3');
    let className = 'join';
    j.classList.add(className);
    j.innerHTML = 'You joined';
    messageArea.appendChild(j);
    socket.emit('new-user', name);
}

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
});


function sendMessage(msg) {
    let msg1 = {
        user : name,
        message : msg.trim()
    }

    appendMessage(msg1, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    socket.emit('message', msg1);
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className,'message');

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

//receive message
socket.on('message', (msg)=>{
    appendMessage(msg, 'incoming');   
    scrollToBottom(); 
});

socket.on('user-connected', (name) => {
    let j = document.createElement('h3');
    let className = 'join';
    j.classList.add(className);
    j.innerHTML = name + ' joined';
    messageArea.appendChild(j);    
});

socket.on('user-disconnected', (name) => {
    let j = document.createElement('h3');
    let className = 'join';
    j.classList.add(className);
    j.innerHTML = name + ' left';
    messageArea.appendChild(j);    
});


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}