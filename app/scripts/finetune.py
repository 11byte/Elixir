import torch
import torch.nn as nn
import torch.optim as optim
from transformers import AutoModelForCausalLM, AutoTokenizer
from torch.utils.data import Dataset, DataLoader
import json

# Load dataset
with open("human_behavior_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

texts = [entry["text"] for entry in data]  # Extract text

# Load pre-trained model and tokenizer
MODEL_NAME = "facebook/opt-125m"  # Change if using a different model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).cuda()

# Tokenize dataset
class TextDataset(Dataset):
    def __init__(self, texts, tokenizer, max_length=128):
        self.tokenizer = tokenizer
        self.input_ids = []
        
        for text in texts:
            tokens = tokenizer(text, truncation=True, padding="max_length", max_length=max_length, return_tensors="pt")
            self.input_ids.append(tokens.input_ids.squeeze(0))
        
    def __len__(self):
        return len(self.input_ids)

    def __getitem__(self, idx):
        return self.input_ids[idx], self.input_ids[idx]

# Create DataLoader
dataset = TextDataset(texts, tokenizer)
dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

# Define optimizer and loss function
optimizer = optim.AdamW(model.parameters(), lr=5e-5)
criterion = nn.CrossEntropyLoss()

# Fine-tuning loop
EPOCHS = 3
model.train()

for epoch in range(EPOCHS):
    total_loss = 0
    for batch in dataloader:
        input_ids, labels = batch
        input_ids, labels = input_ids.cuda(), labels.cuda()
        optimizer.zero_grad()
        
        outputs = model(input_ids, labels=input_ids)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
    
    print(f"Epoch {epoch+1}, Loss: {total_loss/len(dataloader):.4f}")

# Save fine-tuned model
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")
print("✅ Fine-tuning complete! Model saved in ./fine_tuned_model")
