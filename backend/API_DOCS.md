# Prediction Market Aggregator - API Documentation

Base URL: `http://localhost:3000`

## Core API Endpoints

### 1. Market Claims (Atomic)
Returns a flat list of normalized market claims. No aggregation. Each object represents ONE market from a specific source.

- **URL**: `/events/marketclaims`
- **Method**: `GET`
- **Response**: `MarketClaim[]`
- **Example**:
  ```json
  [
    {
      "claimId": "89e9f3b1...",
      "source": "polymarket",
      "marketId": "123",
      "subject": "ETH_PRICE",
      "metric": "price_usd",
      "operator": ">=",
      "threshold": 2000,
      "deadline": "2024-12-31T23:59:59Z",
      "resolutionSource": "coinbase",
      "originalQuestion": "Will ETH be above $2000?",
      "url": "https://polymarket.com/..."
    }
  ]
  ```

### 2. Canonical Events (Aggregated)
Returns derived events created by grouping market claims by their semantic core (subject, metric, operator, threshold).

- **URL**: `/events/canonical`
- **Method**: `GET`
- **Response**: `CanonicalEvent[]`
- **Example**:
  ```json
  [
    {
      "eventID": "EVT_a1b2c3d4...",
      "subject": "ETH_PRICE",
      "metric": "price_usd",
      "operator": ">=",
      "threshold": 2000,
      "earliestDeadline": "2024-12-31T23:59:59Z",
      "consensusSource": "coinbase",
      "markets": [
        { "source": "polymarket", "marketId": "123", "url": "...", "deadline": "..." },
        { "source": "manifold", "marketId": "456", "url": "...", "deadline": "..." }
      ]
    }
  ]
  ```

## Raw Market Endpoints (Adapter Level)
These endpoints return the raw API payloads from each provider.

- `GET /markets/kalshi`
- `GET /markets/polymarket`
- `GET /markets/robinhood`
- `GET /markets/manifold`
- `GET /markets/all`

---

## Data Models

### MarketClaim (Atomic)
Standardized semantic extraction for a single market.

| Field | Type | Description |
|-------|------|-------------|
| `claimId` | `string` | Deterministic hash of `source + marketId` |
| `subject` | `string` | Canonical identifier (e.g., `ETH_PRICE`) |
| `metric` | `string` | The value being measured (e.g., `price_usd`) |
| `operator` | `string` | Comparison operator (`==`, `>=`, etc.) |
| `threshold` | `number\|string` | The target value for resolution |
| `deadline` | `string` | ISO date string for market resolution |
| `resolutionSource` | `string` | Expected provider of ground truth |
| `source` | `string` | Provider (polymarket, manifold, etc.) |
| `originalQuestion` | `string` | Raw question text from the source |

### CanonicalEvent (Derived)
A group of overlapping market claims representing a single real-world event.

| Field | Type | Description |
|-------|------|-------------|
| `eventID` | `string` | Deterministic hash of `core + earliestDeadline` |
| `subject` | `string` | Same as MarketClaim |
| `metric` | `string` | Same as MarketClaim |
| `earliestDeadline` | `string` | Minimum deadline among grouped claims |
| `markets` | `array` | List of contributing sources and their metadata |

---

## System Endpoints

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{ "status": "ok", "timestamp": "..." }`
