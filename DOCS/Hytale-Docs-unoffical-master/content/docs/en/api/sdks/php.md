---
id: php
title: PHP SDK
sidebar_label: PHP
sidebar_position: 2
---

# PHP SDK

PHP SDK for Hytale API.

## Installation

```bash
composer require hytale-api/sdk-php
```

## Usage

```php
use HytaleAPI\Client;

$client = new Client();
$posts = $client->blog()->getPosts();
```

## GitHub

[mTxServ/hytale-api-sdk-php](https://github.com/mTxServ/hytale-api-sdk-php)
