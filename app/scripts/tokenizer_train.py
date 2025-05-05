import sentencepiece as spm

# Train SentencePiece tokenizer
spm.SentencePieceTrainer.train(input="train_corpus.txt", model_prefix="tokenizer", vocab_size=32000)

print("✅ Tokenizer training complete. Model saved as tokenizer.model")
