---
id: authentication
title: API Authentication
sidebar_label: Authentication
sidebar_position: 2
---

# API Authentication

Hytale uses **OAuth 2.0** for server authentication, following RFC 6749 and RFC 8628 specifications.

## Public Endpoints

These endpoints don't require authentication:

- `/blog/post/published` - List published blog posts
- `/blog/post/slug/{slug}` - Get specific post
- `/blog/post/archive/{year}/{month}/` - Archived posts
- `/job/listing` - Job listings

## Server Authentication (OAuth 2.0)

Server operators use OAuth 2.0 to obtain tokens that authorize servers to create game sessions.

### Token Specifications

| Token Type | TTL | Refresh |
|------------|-----|---------|
| **Game Session** | 1 hour | Via refresh token |
| **Refresh Token** | 30 days | Via `/oauth2/token` |

Tokens refresh automatically **5 minutes before expiry** in `EXTERNAL_SESSION` mode.

### Authentication Methods

#### Method 1: Device Authorization (Console Access)

For servers with console access:

```bash
# In server console
/auth login device
```

User visits `https://accounts.hytale.com/device` and enters the displayed code.

#### Method 2: Headless/Automated

For automated setups without console:

```http
POST https://oauth.accounts.hytale.com/oauth2/device/auth
Content-Type: application/x-www-form-urlencoded

client_id=your_client_id
scope=server
```

### Token Refresh

```http
POST https://oauth.accounts.hytale.com/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
refresh_token=your_refresh_token
```

## Server Limits

| Limit | Value |
|-------|-------|
| **Servers per license** | 100 |
| **For more capacity** | Purchase additional licenses or apply for Server Provider account |

## Third-Party Authentication

### HyAuth

[HyAuth](https://www.hyauth.com/) is an independent authentication service for Hytale:

- API response time < 100ms
- No data storage (immediate deletion)
- Flexible permission scopes

**Available Data (by scope):**
- Usernames
- Email
- Game editions
- Profile UUIDs

**Basic Flow:**

```http
POST https://hyauth.com/api/auth/create
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "scopes": ["username", "uuid"],
  "redirect_url": "https://your-server.com/callback"
}
```

:::warning
HyAuth is NOT affiliated with Hypixel Studios or Hytale.
:::

## Official Documentation

- [Server Provider Authentication Guide](https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide)
- [Hytale Server Manual](https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual)
