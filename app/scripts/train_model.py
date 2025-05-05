import torch
import torch.nn as nn
import torch.optim as optim
from model_define import TransformerModel  # Import model
from tokenizers import Tokenizer
from torch.utils.data import DataLoader, TensorDataset

# Set device (Use CPU to avoid CUDA memory issues)
device = torch.device("cpu")

# Load tokenizer
tokenizer = Tokenizer.from_file("tokenizer.json")
print("✅ Tokenizer loaded successfully.")

# Define model parameters
vocab_size = tokenizer.get_vocab_size()  # Adjust based on tokenizer
embedding_size = 256
num_heads = 8
num_layers = 6
ff_dim = 512
batch_size = 16  # Reduce batch size to fit in memory

# Initialize model
model = TransformerModel(vocab_size, embedding_size, num_heads, num_layers, ff_dim).to(device)
print("✅ Transformer model defined.")
print("⚙️ Using CPU for training.")

# Load real training data
with open("train_corpus.txt", "r", encoding="utf-8") as f:
    text_data = f.read().splitlines()  # Read lines as sentences

# Tokenize
tokens = [tokenizer.encode(line).ids for line in text_data]

# Set max sequence length
MAX_SEQ_LEN = 64

# Pad sequences
padded_tokens = [seq[:MAX_SEQ_LEN] + [0] * (MAX_SEQ_LEN - len(seq)) for seq in tokens]

# Convert into tensors
tensor_data = torch.tensor(padded_tokens, dtype=torch.long)

# Create DataLoader (Memory Efficient)
dataset = TensorDataset(tensor_data[:, :-1], tensor_data[:, 1:])
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# Define loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
EPOCHS = 10
for epoch in range(EPOCHS):
    for src, tgt in dataloader:  # Process in batches
        src, tgt = src.to(device), tgt.to(device)

        optimizer.zero_grad()
        output = model(src, tgt)  # (batch, seq, vocab_size)

        loss = criterion(output.view(-1, vocab_size), tgt.reshape(-1))
        loss.backward()
        optimizer.step()

    print(f"Epoch {epoch + 1}, Loss: {loss.item():.4f}")

# Save trained model
torch.save(model.state_dict(), "transformer_model.pth")
print("✅ Training completed and model saved as transformer_model.pth.")
