import torch
import torch.nn as nn

class TransformerModel(nn.Module):
    def __init__(self, vocab_size, embed_dim=256, num_heads=8, num_layers=6, ff_dim=512):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.positional_encoding = nn.Parameter(torch.zeros(1, 500, embed_dim))  # Adjust max length if needed
        self.transformer = nn.Transformer(
            d_model=embed_dim,
            nhead=num_heads,
            num_encoder_layers=num_layers,
            num_decoder_layers=num_layers,
            dim_feedforward=ff_dim,
            batch_first=True  # Ensures (batch, seq, feature) order
        )
        self.fc_out = nn.Linear(embed_dim, vocab_size)

    def forward(self, src, tgt):
        src_emb = self.embedding(src) + self.positional_encoding[:, :src.size(1), :]
        tgt_emb = self.embedding(tgt) + self.positional_encoding[:, :tgt.size(1), :]
        
        # Transformer requires (batch, seq_len, embed_dim)
        src_emb = src_emb.permute(1, 0, 2)  # (seq, batch, embed_dim)
        tgt_emb = tgt_emb.permute(1, 0, 2)
        
        transformer_out = self.transformer(src_emb, tgt_emb)
        return self.fc_out(transformer_out.permute(1, 0, 2))  # Convert back to (batch, seq, vocab_size)

print("✅ Transformer model defined.")
