from flask import Flask, request, jsonify
from transformers import pipeline
import whisper
import tempfile
import base64

app = Flask(__name__)
chatbot = pipeline("text-generation", model="gpt2")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    prompt = data.get("prompt", "")
    result = chatbot(prompt, max_length=50, num_return_sequences=1)
    return jsonify({"response": result[0]["generated_text"]})

@app.route("/whisper", methods=["POST"])
def whisper_transcribe():
    data = request.json
    audio_data = base64.b64decode(data["audio"])
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
        temp.write(audio_data)
        temp.flush()
        model = whisper.load_model("base")
        result = model.transcribe(temp.name)
    return jsonify({"text": result["text"]})

@app.route("/admin/users", methods=["GET"])
def get_users():
    return jsonify({"users": [{"email": "user1@example.com"}, {"email": "user2@example.com"}]})

if __name__ == "__main__":
    app.run(debug=True)
