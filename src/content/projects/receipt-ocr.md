---
title: "Receipt OCR Engine"
description: "An efficient open-source OCR engine for receipt image processing. Combines Tesseract OCR for raw text extraction with LLM-powered structured data parsing — available as a CLI tool and FastAPI service."
publishedAt: "2023-12-01"
tags: [Python, OCR, LLM, FastAPI]
image: "https://opengraph.githubassets.com/1/bhimrazy/receipt-ocr"
githubLink: "https://github.com/bhimrazy/receipt-ocr"
featured: true
---

## Overview

**Receipt OCR Engine** is a comprehensive solution for extracting structured data from receipt images. It ships two modules:

- **`receipt_ocr`** — LLM-powered extraction pipeline with a CLI, programmatic API, and a production FastAPI service
- **`tesseract_ocr`** — Raw text extraction via Tesseract OCR with Docker support

## Quick Start

```bash
pip install receipt-ocr
export OPENAI_API_KEY="your_key"
receipt-ocr images/receipt.jpg
```

## Features

- Structured JSON output (merchant, items, totals, tax)
- CLI and programmatic API
- Docker-ready FastAPI service
- Full test coverage via pytest + codecov
- MIT licensed
