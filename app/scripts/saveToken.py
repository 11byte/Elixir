from transformers import T5Tokenizer

model_name = "t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name)

# Save tokenizer to the checkpoint directory
tokenizer.save_pretrained("./results/checkpoint-21")
