from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configure Gemini API
genai.configure(api_key="GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-1.5-pro-latest")

def get_profession_concept(profession):
    """Fetch a famous concept based on profession using Gemini API."""
    prompt = (
        f"Provide a well-known fundamental concept in the field of {profession}. "
        f"Just give the title of the concept and a one-line statement about it. "
        f"The concept should not be too complex; just a basic fundamental one."
    )
    response = model.generate_content(prompt)
    
    return response.text.strip() if response and response.text else "General Knowledge"

def evaluate_response(concept, user_explanation):
    """Evaluate the user's explanation of the concept."""
    prompt = (
        f"Evaluate the following explanation of the concept '{concept}'. "
        f"Give a structured output with these metrics:\n"
        f"- 'clarity' (0-10 scale)\n"
        f"- 'accuracy' (0-10 scale)\n"
        f"- 'depth' (0-10 scale)\n"
        f"- 'feedback' (brief feedback for improvement)\n\n"
        f"User's explanation:\n{user_explanation}"
    )
    response = model.generate_content(prompt)
    return response.text.strip() if response and response.text else "{}"

def parse_evaluation_result(evaluation_text):
    """Parse the Gemini AI evaluation text into structured JSON."""
    clarity_match = re.search(r'\*\*Clarity:\*\*\s*(\d+\/\d+)', evaluation_text)
    accuracy_match = re.search(r'\*\*Accuracy:\*\*\s*(\d+\/\d+)', evaluation_text)
    depth_match = re.search(r'\*\*Depth:\*\*\s*(\d+\/\d+)', evaluation_text)
    
    feedback_split = evaluation_text.split('**Feedback:**')
    feedback_text = feedback_split[1].strip() if len(feedback_split) > 1 else ""

    return {
        "clarity": clarity_match.group(1) if clarity_match else "N/A",
        "accuracy": accuracy_match.group(1) if accuracy_match else "N/A",
        "depth": depth_match.group(1) if depth_match else "N/A",
        "feedback": feedback_text
    }

@app.route("/get-concept", methods=["POST"])
def fetch_concept():
    data = request.json
    profession = data.get("profession", "")
    if not profession:
        return jsonify({"error": "Profession is required"}), 400
    
    concept = get_profession_concept(profession)
    return jsonify({"concept": concept})

@app.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.json
    concept = data.get("concept", "")
    user_response = data.get("user_response", "")
    
    if not concept or not user_response:
        return jsonify({"error": "Both concept and user response are required"}), 400
    
    evaluation_text = evaluate_response(concept, user_response)
    structured_evaluation = parse_evaluation_result(evaluation_text)

    return jsonify({"evaluation": structured_evaluation})

if __name__ == "__main__":
    app.run(debug=True)
