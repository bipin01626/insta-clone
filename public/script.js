const socket = io();

function sendText() {
  let msg = document.getElementById("msg").value;

  if (msg.trim() === "") return;

  socket.emit("chat message", {
    type: "text",
    message: msg
  });

  document.getElementById("msg").value = "";
}

function addEmoji(e) {
  document.getElementById("msg").value += e;
}

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
    type: "image",
    message: json.url
  });
}

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