---
title: "Chat with MiniCPM-V 2.6"
description: "Deploy MiniCPM-V 2.6 — a GPT-4V level multimodal LLM designed for edge devices — using LitServe. Handles single image, multi-image, and video inputs."
publishedAt: "2024-08-16"
tags: [LitServe, Multimodal, LLM, MiniCPM]
image: "https://opengraph.githubassets.com/1/bhimrazy/chat-with-minicpm"
githubLink: "https://github.com/bhimrazy/chat-with-minicpm"
---

## Overview

**MiniCPM-V 2.6** is the most capable model in the MiniCPM-V series — designed to deliver GPT-4V-level multimodal performance while running efficiently on mobile and edge hardware.

This project deploys it via LitServe for scalable REST API serving, supporting:
- Single image QA
- Multi-image reasoning
- Video understanding

## Get Started

```bash
pip install -r requirements.txt
python server.py   # LitServe API
python client.py   # send queries
```
