import torch
import torch.nn as nn
from model_define import TransformerModel
from tokenizers import Tokenizer  # Load the tokenizer correctly

# Set device (Use CPU)
device = torch.device("cpu")

# Define model parameters (same as training)
vocab_size = 5000  # Should match training vocab size
embedding_size = 256
num_heads = 8
num_layers = 6
ff_dim = 512

# Load trained model
model = TransformerModel(vocab_size, embedding_size, num_heads, num_layers, ff_dim).to(device)
model.load_state_dict(torch.load("transformer_model.pth", map_location=device))
model.eval()
print("✅ Model loaded successfully.")

# Load tokenizer from local file (Fixed)
tokenizer = Tokenizer.from_file("tokenizer.json")
print("✅ Tokenizer loaded successfully.")

# Dummy input for testing (Replace with actual input)
test_text = "Hello, how are you?"  # Example input text
encoded_input = tokenizer.encode(test_text).ids  # Convert text to token IDs
test_input = torch.tensor([encoded_input], dtype=torch.long).to(device)

# Generate output
with torch.no_grad():
    output = model(test_input, test_input)  # Adjust inference method if needed

# Convert output to token indices
output_tokens = output.argmax(dim=-1).squeeze(0).tolist()

# Decode token indices into words
decoded_text = tokenizer.decode(output_tokens)

print("🔍 Model output (decoded):", decoded_text)
