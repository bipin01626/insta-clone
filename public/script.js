const socket = io();

// send text
function sendText() {
  let input = document.getElementById("msg");
  let msg = input.value;

  if (msg.trim() === "") return;

  socket.emit("chat message", {
    type: "text",
    message: msg
  });

  input.value = "";
}

// emoji
function addEmoji(e) {
  document.getElementById("msg").value += e;
}

// image send
async function sendImage() {
  let file = document.getElementById("file").files[0];

  if (!file) return alert("Select image");

  let formData = new FormData();
  formData.append("image", file);

  let res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  let data = await res.json();

  socket.emit("chat message", {
    type: "image",
    message: data.url
  });
}

// voice (basic)
function recordVoice() {
  alert("Voice feature coming soon 😄");
}

// receive message
socket.on("chat message", (data) => {
  let li = document.createElement("li");

  if (data.type === "image") {
    li.innerHTML = `<img src="${data.message}" width="150">`;
  } else {
    li.innerText = data.message;
  }

  document.getElementById("messages").appendChild(li);

  document.getElementById("sound").play();
});

// enter key
document.getElementById("msg").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendText();
});