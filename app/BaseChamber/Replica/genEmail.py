import random
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017')
db = client['elixir_db']
emails_collection = db['emails']

# Load the lightweight LLM model
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
diary_collection = db["entries"]
@app.route('/api/submit-diary', methods=['POST'])
def submit_diary():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Insert into MongoDB
        diary_collection.insert_one({
            "date": data["date"],
            "entries": data["entries"]
        })

        return jsonify({"message": "Diary submitted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generateEmail', methods=['POST'])
def generate_email_endpoint():
    try:
        # Receive subject from frontend
        data = request.get_json()
        subject_from_frontend = data.get('subject', '')
        
        if not subject_from_frontend:
            return jsonify({'error': 'No subject provided'}), 400

        # Retrieve emails from the database
        emails = list(emails_collection.find({}, {'_id': 0, 'subject': 1, 'body': 1}))

        if not emails:
            return jsonify({'error': 'No emails found in database'}), 404

        # Combine subject and body of emails to calculate TF-IDF
        texts = [email['subject'] + " " + email['body'] for email in emails]

        # Calculate TF-IDF
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(texts)
        tfidf_array = tfidf_matrix.toarray()
        feature_names = vectorizer.get_feature_names_out()

        # Generate a new email based on user style and provided subject
        generated_email = generate_email_model(subject_from_frontend, tfidf_array, feature_names, texts)

        return jsonify({
            'generatedEmail': generated_email
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def analyze_writing_style(existing_texts):
    """
    Analyze existing emails to determine the tone.
    """
    combined_text = " ".join(existing_texts).lower()
    
    # Simple tone detection
    if "dear" in combined_text and "regards" in combined_text:
        tone = "formal"
    elif "hey" in combined_text or "hi" in combined_text:
        tone = "informal"
    else:
        tone = "neutral"

    # Average sentence length
    sentences = combined_text.split('.')
    avg_length = np.mean([len(sentence.split()) for sentence in sentences if sentence])

    if avg_length < 10:
        verbosity = "brief"
    else:
        verbosity = "detailed"

    return tone, verbosity


def generate_with_llm(prompt, max_length=128):
    """
    Generate text from LLM given a prompt.
    """
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_length=max_length, temperature=0.8, top_p=0.95, do_sample=True)
    decoded_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return decoded_output


def generate_email_model(subject, tfidf_array, feature_names, existing_texts, top_k=7):
    """
    Create a dynamic email based on TF-IDF important words and user writing style.
    """
    # Analyze writing style
    tone, verbosity = analyze_writing_style(existing_texts)

    # Calculate mean TF-IDF across all emails
    mean_tfidf = np.mean(tfidf_array, axis=0)

    # Get top_k words and their TF-IDF values
    top_indices = mean_tfidf.argsort()[-top_k:][::-1]
    top_words = [feature_names[i] for i in top_indices]
    top_values = [mean_tfidf[i] for i in top_indices]

    # Introduction
    if tone == "formal":
        intro = f"Dear Team,\n\nI hope this message finds you well.\n\nSubject: {subject}\n\n"
    elif tone == "informal":
        intro = f"Hey everyone,\n\nJust wanted to drop a quick note.\n\nTopic: {subject}\n\n"
    else:
        intro = f"Hello Team,\n\nRegarding: {subject}\n\n"

    # Construct the prompt by including the subject, important words, and their TF-IDF values
    word_info = "\n".join([f"The word '{word}' has a TF-IDF value of {value}." for word, value in zip(top_words, top_values)])

    # LLM Prompt with all necessary context
    llm_prompt = f"""
    Write an email about the topic '{subject}' in a {tone} and {verbosity} style in detail in 8-9 lines.
    Include the following key points based on the importance of words extracted from past emails:

    {word_info}

    Use the subject: '{subject}' and make sure the email is coherent, well-structured, and reflects the tone and verbosity described.
    """

    # Generate the email body using the LLM
    generated_body = generate_with_llm(llm_prompt)

    # Closing
    if tone == "formal":
        closing = "\n\nLooking forward to your valuable feedback.\n\nBest regards,\nYour Name"
    elif tone == "informal":
        closing = "\n\nCatch you later!\n\nCheers,\nYour Name"
    else:
        closing = "\n\nThanks and Regards,\nYour Name"

    # Combine full email
    full_body = intro + generated_body + closing

    generated_email = {
        'subject': subject,
        'body': full_body
    }

    return generated_email


if __name__ == '__main__':
    app.run(debug=True, port=5000)
