from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend communication

# Load the fine-tuned model and tokenizer (default model)
model_path = r"C:\Users\omkar\OneDrive\Desktop\elixir\app\scripts\fine_tuned_model\checkpoint-5250"
model = AutoModelForCausalLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# Move model to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def generate_text(prompt, max_length=100):
    """Generates text response from the default model."""
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            do_sample=True,  # Enables randomness
            temperature=0.7,  # Adjusts creativity (Lower = More Deterministic)
            top_p=0.9,  # Nucleus Sampling (Filters Low-Probability Words)
            repetition_penalty=1.2,  # Penalizes Repetitions
            no_repeat_ngram_size=2  # Prevents Word N-gram Repeats
        )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def generate_text_with_gemini(prompt):
   
    
    prompt = f"Act as a therapist and answer my question in 50 words which is: {prompt}"
   

    genai.configure(api_key="GEMINI_API_KEY")
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
   

        
    response = model.generate_content(prompt)
    # Return the generated text from Gemini
    if response and response.text:
        return response.text
    else:
        return "Error: No response received from Gemini."

@app.route('/chat', methods=['POST'])
def chat():
    """Handles chat requests from the frontend."""
    data = request.json
    user_message = data.get("message", "")
    model_name = data.get("model", "Luna SLM v1.0")  

    if not user_message.strip():
        return jsonify({"reply": "Please enter a valid message!"}), 400

    if "Gemini" in model_name:  # Check if the model is Gemini
        bot_response = generate_text_with_gemini(user_message)
    else:
        bot_response = generate_text(user_message)

    return jsonify({"reply": bot_response})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
