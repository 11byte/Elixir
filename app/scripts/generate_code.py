from transformers import T5Tokenizer, T5ForConditionalGeneration
import sys

# Load the trained model
model_path = "slm_model"
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)

# Get user query
user_query = sys.argv[1]

# Tokenize input query
input_ids = tokenizer(user_query, return_tensors="pt").input_ids

# Generate code
output = model.generate(input_ids)
generated_code = tokenizer.decode(output[0], skip_special_tokens=True)

print(generated_code)
