---
title: "Chat with Qwen2-VL"
description: "Deploy and chat with Alibaba's Qwen2-VL multimodal large language model using LitServe. Supports image understanding, document parsing, and visual reasoning tasks."
publishedAt: "2024-08-31"
tags: [LitServe, Multimodal, LLM, Qwen]
image: "https://opengraph.githubassets.com/1/bhimrazy/chat-with-qwen2-vl"
githubLink: "https://github.com/bhimrazy/chat-with-qwen2-vl"
liveLink: "https://lightning.ai/bhimrajyadav/studios/deploy-and-chat-with-qwen2-vl-using-litserve"
---

## Overview

**Qwen2-VL** is Alibaba Cloud's flagship multimodal LLM series, supporting image understanding, multi-image reasoning, and video analysis.

This project provides a production-ready deployment using LitServe for high-throughput inference, with a clean chat interface for visual question answering.

## Get Started

```bash
pip install -r requirements.txt
python server.py   # starts LitServe inference API
python client.py   # send image + text queries
```
