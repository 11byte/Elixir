from datasets import load_dataset

# Load dataset
dataset = load_dataset("wikitext", "wikitext-103-v1")

# Extract training text
train_texts = dataset["train"]["text"]

# Remove empty lines
train_texts = [text for text in train_texts if text.strip()]

# Join into a single large text corpus
train_corpus = " ".join(train_texts)

# Save to a text file
with open("train_corpus.txt", "w", encoding="utf-8") as f:
    f.write(train_corpus)

print("✅ Data preprocessing complete. Corpus saved.")
