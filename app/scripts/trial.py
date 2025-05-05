# from transformers import AutoModelForCausalLM, AutoTokenizer

# model_name = "facebook/opt-125m"  # Alternative pre-trained model
# model = AutoModelForCausalLM.from_pretrained(model_name)
# tokenizer = AutoTokenizer.from_pretrained(model_name)

# print("✅ Pre-trained WikiText-103 model loaded successfully!")
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_name = "facebook/opt-125m"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Set model to evaluation mode
model.eval()

# Define input text
input_text = input("Enter your input: ")

# Tokenize input
input_ids = tokenizer.encode(input_text, return_tensors="pt")

# Generate text with improved randomness
output_ids = model.generate(
    input_ids,
    max_length=500,   
    do_sample=True,  # ✅ Enables sampling (randomness)
    temperature=0.7,  # Adds randomness (higher = more creative)
    top_k=50,        # Sample from top 50 words
    top_p=0.9,       # Nucleus sampling (diverse choices)
    repetition_penalty=1.2  # Reduces repeating loops
)

# Decode output tokens to text
generated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

print("🔍 Generated Text:", generated_text)
