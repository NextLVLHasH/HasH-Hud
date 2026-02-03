---
id: javascript
title: SDK JavaScript
sidebar_label: JavaScript
sidebar_position: 1
---

# SDK JavaScript

SDK pour Node.js et navigateur.

## Installation

```bash
npm install @hytale-api/sdk
```

## Utilisation

```javascript
import { HytaleAPI } from '@hytale-api/sdk';

const api = new HytaleAPI();
const posts = await api.blog.getPosts();
```

## GitHub

[mTxServ/hytale-api-sdk-js](https://github.com/mTxServ/hytale-api-sdk-js)
