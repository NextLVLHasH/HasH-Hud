---
id: php
title: SDK PHP
sidebar_label: PHP
sidebar_position: 2
---

# SDK PHP

SDK PHP pour l'API Hytale.

## Installation

```bash
composer require hytale-api/sdk-php
```

## Utilisation

```php
use HytaleAPI\Client;

$client = new Client();
$posts = $client->blog()->getPosts();
```

## GitHub

[mTxServ/hytale-api-sdk-php](https://github.com/mTxServ/hytale-api-sdk-php)
