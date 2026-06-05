---
title: "Chatterbox TTS API"
description: "Production-ready Text-to-Speech API built on Resemble AI's Chatterbox model with LitServe. Supports zero-shot voice cloning, emotion intensity control, and base64 audio I/O."
publishedAt: "2026-03-12"
tags: [LitServe, TTS, Voice Cloning, AI]
image: "https://opengraph.githubassets.com/1/bhimrazy/litserve-examples"
githubLink: "https://github.com/bhimrazy/litserve-examples/tree/main/chatterbox-tts"
liveLink: "https://lightning.ai/bhimrajyadav/studios/build-a-production-ready-tts-api-with-chatterbox-powered-by-litserve"
---

## Overview

**Chatterbox TTS API** wraps Resemble AI's [Chatterbox](https://huggingface.co/ResembleAI/chatterbox) model — an open-source, MIT-licensed TTS model — in a LitServe-powered REST API built for production use.

## Features

- **Zero-shot voice cloning** — clone any voice from a short reference audio clip
- **Emotion control** — tune exaggeration (0.0–1.0) and CFG weight for expressive speech
- **Flexible I/O** — accepts file paths or base64-encoded audio
- **CLI client** — `python client.py --text "..." --audio-prompt voice.wav --play`

## Get Started

```bash
cd chatterbox-tts
pip install -r requirements.txt
python server.py
python client.py --text "Hello from Chatterbox!" --play
```
