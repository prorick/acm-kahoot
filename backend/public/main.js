const userList = document.getElementById('users');
const correctUserList = document.getElementById('correctUsers');
const answeredUsersList = document.getElementById('answeredUsers');
const questionList = document.getElementById('questionList');
const roomID = document.getElementById('room-id');
const countdown = document.getElementById('countdown');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();


function start(packId) {
  console.log(packId)
  async function getData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url);
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  let u = 'http://localhost:3000/packs/'+packId;
  getData(u, { })
    .then(data => {
      let q = data.questions
      socket.emit('start',{q});
    });
  questionTimer(15);
}
function nextQuestion() {
  socket.emit('nextQuestion');
  answeredUsersList.innerHTML = ``;
  clearTime();
  questionTimer(15);
}
function seeResults() {
  socket.emit('seeResults');
}
function getQuestions() {
  async function getData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url);
    return response.json(); // parses JSON response into native JavaScript objects
  }
  getData('http://localhost:3000/packs/names', { })
    .then(data => {
      questionList.innerHTML = `
        ${data.map(question => `<li>
        ${question[0]} <input id=${question[0]} type="button" value="Start Game!" onclick="start(\'${question[2]}\');"/>
        </li>`).join('')}`;
    });
}

// Join chatroom
socket.emit('joinRoomAdmin', { username, room });

// sends question
socket.on('sendQuestion',(question) => {
  console.log(question)
  if(question != -1) {
    document.getElementById('question').innerHTML = question.question;
    document.getElementById('answer1').innerHTML = question.answer;
    document.getElementById('answer2').innerHTML = question.falseAnswers[0];
    document.getElementById('answer3').innerHTML = question.falseAnswers[1];
    document.getElementById('answer4').innerHTML = question.falseAnswers[2];
  }
  else {
    document.getElementById('question').innerHTML = "out of questions";
    document.getElementById('answer1').innerHTML = "";
    document.getElementById('answer2').innerHTML = "";
    document.getElementById('answer3').innerHTML = "";
    document.getElementById('answer4').innerHTML = "";
    clearTime();
  }
});

// get correct users
socket.on('correctUsers',(users) => {
  correctUserList.innerHTML = `
    ${users.map(user => `<li>${user.username} score:${user.score}</li>`).join('')}
  `;
});
// get users who have answered
socket.on('answeredUsers',(users) => {
  answeredUsersList.innerHTML = `
    ${users.map(user => `<li>user:${user.username} score:${user.score}</li>`).join('')}
  `;
  console.log(users + ' hello ')
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomID(room);
  outputUsers(users);
});

socket.on('invalid',() => {
  outputRoomID("ROOM ALREADY EXISTS/HAS ADMIN");
});


// Add users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

// Add room name to DOM
const outputRoomID = (room) => {
  roomID.innerText = room;
}


let timer;
let currTime;

const questionTimer = (time) => {
  countdown.innerHTML = time;
  currTime = time;
  timer = setInterval( updateTime, 1000);
}

const updateTime = () => {
  currTime--;
  countdown.innerHTML = currTime;
  if (currTime <= 0) {
    clearInterval(timer);
    seeResults();
  }
}

const clearTime = () => {
  currTime = 0;
  countdown.innerHTML = currTime;
  clearInterval(timer);
}