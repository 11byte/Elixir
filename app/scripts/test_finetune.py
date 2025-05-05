from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the fine-tuned model and tokenizer

model_path = r"C:\Users\omkar\OneDrive\Desktop\elixir\app\scripts\fine_tuned_model\checkpoint-5250"
model = AutoModelForCausalLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# Move model to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def generate_text(prompt, max_length=100):
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


# Test the model
user_input = "How can you tell if someone is mentally upset based on their speech or actions?"
generated_text = generate_text(user_input)
print("🔹 Generated Text:\n", generated_text)
