const socket = io();

// users
socket.on("users", (users) => {
  let div = document.getElementById("users");
  div.innerHTML = "";

  for (let id in users) {
    let u = document.createElement("div");
    u.innerText = "🟢 " + users[id];
    div.appendChild(u);
  }
});

// send text
function sendText() {
  let msg = document.getElementById("msg").value;

  socket.emit("chat message", {
    message: msg,
    type: "text"
  });

  document.getElementById("msg").value = "";
}

// emoji
function addEmoji(e) {
  document.getElementById("msg").value += e;
}

// image
async function sendImage() {
  let file = document.getElementById("file").files[0];

  let data = new FormData();
  data.append("image", file);

  let res = await fetch("/upload", {
    method: "POST",
    body: data
  });

  let json = await res.json();

  socket.emit("chat message", {
    message: json.url,
    type: "image"
  });
}

// voice
let recorder, chunks = [];

async function recordVoice() {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  recorder = new MediaRecorder(stream);
  recorder.start();

  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = () => {
    let blob = new Blob(chunks);
    let url = URL.createObjectURL(blob);

    socket.emit("chat message", {
      message: url,
      type: "audio"
    });

    chunks = [];
  };

  setTimeout(() => recorder.stop(), 3000);
}

// receive
socket.on("chat message", (data) => {
  let li = document.createElement("li");

  if (data.type === "image") {
    li.innerHTML = `<b>${data.name}</b><br><img src="${data.message}" width="150">`;
  } else if (data.type === "audio") {
    li.innerHTML = `<b>${data.name}</b><br><audio controls src="${data.message}"></audio>`;
  } else {
    li.innerHTML = `<b>${data.name}:</b> ${data.message}`;
  }

  document.getElementById("messages").appendChild(li);

  document.getElementById("sound").play();
});

// typing
document.getElementById("msg").addEventListener("input", () => {
  socket.emit("typing");
});

socket.on("typing", (name) => {
  document.getElementById("typing").innerText = name + " is typing...";
  setTimeout(() => {
    document.getElementById("typing").innerText = "";
  }, 1000);
});

// enter send
document.getElementById("msg").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendText();
});

// dark mode
function toggleDark() {
  document.body.classList.toggle("dark");
}