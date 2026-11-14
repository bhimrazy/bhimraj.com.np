---
title: "vps-ready"
seoTitle: "vps-ready: a Rust CLI for VPS hardening"
seoDescription: "A Rust CLI for VPS hardening on Debian and Ubuntu. Audit a fresh server, review the plan, apply it, and roll back automatically if you can't log in again."
description: "A Rust CLI that makes a fresh VPS ready and secure: audit, plan, apply and roll back, without locking yourself out."
publishedAt: "2026-10-01"
tags: [Rust, CLI, SSH, Security]
category: "Developer Tools"
image: "https://opengraph.githubassets.com/1/bhimrazy/vps-ready"
githubLink: "https://github.com/bhimrazy/vps-ready"
liveLink: "https://vps-ready.bhimraj.com.np"
liveLabel: "Visit the site"
---

## Overview

**vps-ready** is a Rust CLI that makes a fresh VPS ready and secure. It audits the server, plans the changes, applies them, and rolls back if you would otherwise lock yourself out.

## Quick Start

```bash
sudo vps-ready audit
sudo vps-ready apply
```

`audit` reports which checks pass and fail. `apply` makes the changes, then waits for you to confirm from a new SSH login; if you don't, it rolls back.
