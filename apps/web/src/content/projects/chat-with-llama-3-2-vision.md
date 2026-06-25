---
title: "Chat with Llama 3.2 Vision"
description: "Deploy Meta's Llama 3.2 Vision multimodal LLM with LitServe for lightning-fast inference. Supports image understanding and visual question answering via a clean REST API."
publishedAt: "2024-09-25"
tags: [LitServe, Llama, Multimodal, LLM]
image: "https://opengraph.githubassets.com/1/bhimrazy/chat-with-llama-3.2-vision"
githubLink: "https://github.com/bhimrazy/chat-with-llama-3.2-vision"
liveLink: "https://lightning.ai/bhimrajyadav/studios/deploy-and-chat-with-llama-3-2-vision-multimodal-llm-using-litserve-lightning-fast-inference-engine"
---

## Overview

**Llama 3.2 Vision** is Meta's multimodal open model capable of image reasoning, captioning, and visual QA. This project deploys it using LitServe for production-grade serving with minimal boilerplate.

## Get Started

```bash
pip install -r requirements.txt
python server.py   # LitServe API on localhost:8000
python client.py   # send image + prompt
```
