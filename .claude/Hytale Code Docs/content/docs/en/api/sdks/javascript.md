---
id: javascript
title: JavaScript SDK
sidebar_label: JavaScript
sidebar_position: 1
---

# JavaScript SDK

Node.js and browser SDK.

## Installation

```bash
npm install @hytale-api/sdk
```

## Usage

```javascript
import { HytaleAPI } from '@hytale-api/sdk';

const api = new HytaleAPI();
const posts = await api.blog.getPosts();
```

## GitHub

[mTxServ/hytale-api-sdk-js](https://github.com/mTxServ/hytale-api-sdk-js)
