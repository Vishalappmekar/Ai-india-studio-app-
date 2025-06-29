// 🎤 Whisper Voice Recorder
let mediaRecorder, audioChunks;

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        fetch("http://localhost:5000/whisper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: base64Audio })
        })
        .then(res => res.json())
        .then(data => {
          document.getElementById("transcript").innerText = data.text;
        });
      };
      reader.readAsDataURL(blob);
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 4000);
  });
}

// 🤖 Generate with HuggingFace Model
function generateText() {
  const prompt = document.getElementById("prompt").value;
  fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("response").innerText = data.response;
  });
}
