---
title: "Chat with Phi 3.5 Vision"
seoDescription: "Deploy Microsoft's Phi 3.5-vision multimodal LLM with LitServe and a Streamlit UI for multi-image chat, image comparison and video summarization."
description: "Deploy and chat with Microsoft's Phi 3.5-vision multimodal LLM. LitServe serves the model while a Streamlit frontend gives you multi-image chat, comparison, and video summarization."
publishedAt: "2024-05-23"
tags: [LitServe, Multimodal, LLM, Streamlit]
category: "Multimodal LLMs"
image: "https://opengraph.githubassets.com/1/bhimrazy/chat-with-phi-3-vision"
githubLink: "https://github.com/bhimrazy/chat-with-phi-3-vision"
liveLink: "https://lightning.ai/bhimrajyadav/studios/deploy-and-chat-with-phi-3-vision-128k-instruct"
---

## Overview

**Phi-3.5-vision** is Microsoft's lightweight open multimodal model, capable of multi-frame image understanding, image comparison, and video summarization.

This project pairs it with:
- **LitServe** for inference serving
- **Streamlit** for an interactive chat UI
- **Flash Attention** for optimized GPU throughput

## Stack

- `microsoft/Phi-3.5-vision-instruct` via HuggingFace Transformers
- LitServe inference server
- Streamlit chat interface

## Get Started

```bash
pip install -r requirements.txt
python server.py        # start LitServe API
streamlit run app.py   # launch UI
```
