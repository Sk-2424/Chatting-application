
// to connect socket io with client js isme last wala stack overflow se liye hai error hatane ke liye
const socket = io('http://localhost:8000',{ transports: ['websocket', 'polling', 'flashsocket'] });

const message = document.getElementById("inpMsg");  // Message typed i text box
const form = document.getElementById("inpForm"); // complete form
const container = document.querySelector('.container'); // complete chat windoe
const upperContainer = document.querySelector('.userName'); // Upper div jisme usser ka name enter hoga

// Audio object to play audio
const audio = new Audio("ting.mp3")

//Code to append user name when user enter there name in prompt box
const appendUsername = (uname) =>
{
    const ele = document.createElement('h3');
    ele.innerText = uname;
    ele.classList.add('user1');
    upperContainer.append(ele);
}

//User enter there name im Prompt box
const uname = prompt("Enter your name to join");

// funtion to write user name
appendUsername(uname);

// to emit the user joined status
socket.emit('new-user-joined', uname);

// to append new divs in chat window 
const append = (message,position) =>
{
    const ele = document.createElement('div');
    ele.innerText = message;
    ele.classList.add('msg');
    ele.classList.add(position);
    container.append(ele);
    if(position =='left')
    {
        audio.play();
    }
}


// when a new user join
socket.on('user-joined', name => {
    append(`${name} joined the chat`, right);
});


// when we receive a mesage from a user
socket.on('receive', data =>
{
    append(`${data.name}: ${data.message}`,'left');
});


//when a user get disconnected
socket.on('left',data =>
{
    append(`${data} left the chat`,'right');
});

// adding the sending message 
form.addEventListener('submit', (e) =>
{
    e.preventDefault();
    const msg = message.value;
    append(`You: ${msg}`,'right');
    socket.emit('send',msg);
    message.value = '';

})