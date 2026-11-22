---
title: "RF-DETR Object Detection API"
seoDescription: "A real-time object detection REST API for the RF-DETR transformer model, served with LitServe. One forward pass from image to boxes, no anchors or NMS."
description: "Real-time object detection API using RF-DETR, a transformer-based model, deployed with LitServe. End-to-end inference with no region proposals or anchor boxes required."
publishedAt: "2026-03-10"
tags: [LitServe, Object Detection, Transformers, Computer Vision]
category: "Computer Vision & Medical AI"
image: "https://opengraph.githubassets.com/1/bhimrazy/litserve-examples"
githubLink: "https://github.com/bhimrazy/litserve-examples/tree/main/rfdetr-object-detection"
liveLink: "https://lightning.ai/bhimrajyadav/studios/deploy-rf-detr-a-sota-real-time-object-detection-model-using-litserve"
---

## Overview

**RF-DETR** is a real-time, transformer-based object detection model evaluated on COCO. This project exposes it as a REST API via LitServe.

## Key Features

- **Transformer backbone** — robust feature extraction without anchors or NMS
- **End-to-end detection** — single forward pass from image to bounding boxes
- **LitServe serving** — scalable, batching-ready inference endpoint

## Get Started

```bash
cd rfdetr-object-detection
pip install -r requirements.txt
python server.py
curl -X POST http://localhost:8000/predict -F "image=@photo.jpg"
```
