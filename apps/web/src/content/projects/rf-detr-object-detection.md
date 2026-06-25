---
title: "RF-DETR Object Detection API"
description: "Real-time object detection API using RF-DETR, a SOTA transformer-based model, deployed with LitServe. End-to-end inference with no region proposals or anchor boxes required."
publishedAt: "2026-03-10"
tags: [LitServe, Object Detection, Transformers, Computer Vision]
image: "https://opengraph.githubassets.com/1/bhimrazy/litserve-examples"
githubLink: "https://github.com/bhimrazy/litserve-examples/tree/main/rfdetr-object-detection"
liveLink: "https://lightning.ai/bhimrajyadav/studios/deploy-rf-detr-a-sota-real-time-object-detection-model-using-litserve"
---

## Overview

**RF-DETR** is a real-time, transformer-based object detection model achieving SOTA performance on COCO benchmarks. This project exposes it as a production REST API via LitServe.

## Key Features

- **Transformer backbone** — robust feature extraction without anchors or NMS
- **End-to-end detection** — single forward pass from image to bounding boxes
- **High accuracy** — SOTA on COCO and standard detection benchmarks
- **LitServe serving** — scalable, batching-ready inference endpoint

## Get Started

```bash
cd rfdetr-object-detection
pip install -r requirements.txt
python server.py
curl -X POST http://localhost:8000/predict -F "image=@photo.jpg"
```
