---
title: "3D Lung Tumour Segmentation"
description: "3D semantic segmentation of lung tumours from CT scans using PyTorch Lightning and MONAI. Trained on the Medical Segmentation Decathlon lung dataset with a U-Net based architecture."
publishedAt: "2022-04-24"
tags: [PyTorch, MONAI, Medical AI, Segmentation]
image: "https://opengraph.githubassets.com/1/bhimrazy/lung-tumours-segmentation"
githubLink: "https://github.com/bhimrazy/lung-tumours-segmentation"
liveLink: "https://lightning.ai/bhimrajyadav/studios/empowering-3d-lung-tumour-segmentation-with-monai"
---

## Overview

**3D Lung Tumour Segmentation** applies deep learning to medical imaging — specifically, segmenting lung tumours from volumetric CT scans using the [Medical Segmentation Decathlon](http://medicaldecathlon.com/) lung dataset.

The model is built with MONAI's 3D U-Net architecture and trained with PyTorch Lightning for structured, reproducible training.

## Stack

- **MONAI** — medical imaging transforms and 3D U-Net
- **PyTorch Lightning** — training loop and checkpointing
- **Hydra** — configuration management via `conf/config.yaml`
- **FastAPI** — inference REST API (`app/main.py`)

## Training

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python train.py
```
