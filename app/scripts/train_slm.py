import os
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration, Trainer, TrainingArguments
from datasets import load_dataset

# Check and set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Load tokenizer from base model (since it's missing in checkpoint)
tokenizer = T5Tokenizer.from_pretrained("t5-small", legacy=False)

# Load model from latest checkpoint (modify as needed)
model_name = "./results/checkpoint-175"  # Change this if using a new checkpoint
model = T5ForConditionalGeneration.from_pretrained(model_name).to(device)

# Load dataset
dataset = load_dataset("csv", data_files="dataset.csv")

# Check dataset column names
print("Dataset Columns:", dataset["train"].column_names)

# Ensure correct column names (update if different)
input_col = "query"  
label_col = "code"

# Tokenization function
def tokenize_data(example):
    inputs = tokenizer(
        example[input_col],
        padding="max_length",
        truncation=True,
        max_length=256  
    )
    labels = tokenizer(
        example[label_col],
        padding="max_length",
        truncation=True,
        max_length=256
    )
    
    return {
        "input_ids": inputs["input_ids"],
        "attention_mask": inputs["attention_mask"],
        "labels": labels["input_ids"],
    }

# Apply tokenization
dataset = dataset.map(tokenize_data, remove_columns=[input_col, label_col])

# Split dataset into train and test
dataset = dataset["train"].train_test_split(test_size=0.2)

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=25,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=10,
    save_total_limit=2,
    push_to_hub=False,
    fp16=True
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"]
)

# Start training
trainer.train()

# Automatically find the latest checkpoint and save model/tokenizer there
latest_checkpoint = max(
    [d for d in os.listdir(training_args.output_dir) if d.startswith("checkpoint-")],
    key=lambda x: int(x.split("-")[-1]),
)
latest_checkpoint_path = os.path.join(training_args.output_dir, latest_checkpoint)

model.save_pretrained(latest_checkpoint_path)
tokenizer.save_pretrained(latest_checkpoint_path)
print(f"Model and tokenizer saved at {latest_checkpoint_path}")
