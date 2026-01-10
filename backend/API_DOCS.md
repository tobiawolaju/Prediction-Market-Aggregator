# Prediction Market Aggregator - Backend API Documentation

Base URL: `http://localhost:3000`

## System Endpoints

### Health Check
Returns the status of the server.

- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
  ```

## Market Data Endpoints

### Get All Markets
Fetches and aggregates market data from all configured sources (Kalshi, Polymarket, Robinhood, and Manifold).

- **URL**: `/markets/all`
- **Method**: `GET`
- **Response**: Array of `NormalizedMarket` objects.
  ```json
  [
    {
      "source": "polymarket",
      "marketId": "12345",
      "eventKey": "will-bitcoin-hit-100k",
      "outcome": "YES",
      "impliedProbability": 0.65,
      "liquidity": 150000,
      "rawPayload": { ... }
    },
    {
      "source": "robinhood",
      "marketId": "3d961844-d360-45fc-989b-f6fca761d511",
      "eventKey": "BTC-USD",
      "outcome": "PRICE",
      "impliedProbability": 0,
      "price": 45000.50,
      "liquidity": 0,
      "rawPayload": { ... }
    },
    {
      "source": "kalshi",
      "marketId": "KRNY-24DEC31",
      "eventKey": "KRNY-24DEC31",
      "outcome": "YES",
      "impliedProbability": 0.45,
      "liquidity": 50000,
      "rawPayload": { ... }
    }
  ]
  ```

### Get Kalshi Markets
Fetches market data specifically from Kalshi.

- **URL**: `/markets/kalshi`
- **Method**: `GET`
- **Response**: Array of `NormalizedMarket` objects from Kalshi.

### Get Polymarket Markets
Fetches market data specifically from Polymarket.

- **URL**: `/markets/polymarket`
- **Method**: `GET`
- **Response**: Array of `NormalizedMarket` objects from Polymarket.

### Get Robinhood Markets
Fetches market data specifically from Robinhood (Crypto).

- **URL**: `/markets/robinhood`
- **Method**: `GET`
- **Response**: Array of `NormalizedMarket` objects from Robinhood.

### Get Manifold Markets
Fetches market data specifically from Manifold Markets.

- **URL**: `/markets/manifold`
- **Method**: `GET`
- **Response**: Array of `NormalizedMarket` objects from Manifold.

## Event Normalization Endpoints

### Get Normalized Events
Fetches and normalizes prediction market data from Polymarket and Manifold, grouping markets by real-world events with aggregated statistics.

- **URL**: `/events/normalized`
- **Method**: `GET`
- **Response**: Array of `NormalizedEventResponse` objects.
  ```json
  [
    {
      "event": {
        "eventId": "a1b2c3d4e5f6g7h8",
        "canonicalQuestion": "Will Bitcoin hit $100,000 in 2024?",
        "resolutionTime": "2024-12-31T23:59:59Z",
        "category": "Crypto"
      },
      "markets": [
        {
          "source": "polymarket",
          "marketId": "12345",
          "outcome": "YES",
          "impliedProbability": 0.65,
          "liquidity": 150000,
          "lastUpdated": "2024-01-10T12:00:00Z",
          "rawPayload": { ... }
        },
        {
          "source": "manifold",
          "marketId": "abc123",
          "outcome": "YES",
          "impliedProbability": 0.62,
          "liquidity": 5000,
          "lastUpdated": "2024-01-10T11:30:00Z",
          "rawPayload": { ... }
        }
      ],
      "aggregate": {
        "liquidityWeightedProbability": 0.649,
        "probabilityVariance": 0.00045,
        "marketCount": 2
      }
    }
  ]
  ```

## Data Model

### NormalizedMarket
Standardized format for all market data.

| Field | Type | Description |
|-------|------|-------------|
| `source` | `string` | "kalshi" or "polymarket" |
| `marketId` | `string` | Unique identifier from the source |
| `eventKey` | `string` | Canonical event identifier (slug or ticker) |
| `outcome` | `string` | The outcome being predicted (e.g., "YES") |
| `impliedProbability` | `number` | Probability between 0.0 and 1.0 |
| `price` | `number` | (Optional) For non-probability markets (e.g. crypto) |
| `liquidity` | `number` | (Optional) Volume or liquidity metric |
| `spread` | `number` | (Optional) Bid-ask spread |
| `rawPayload` | `object` | The original raw data from the provider |

### CanonicalEvent
Represents a real-world event independent of venue.

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | `string` | Stable hash derived from question + resolution time |
| `canonicalQuestion` | `string` | The event question/proposition |
| `resolutionTime` | `string \| null` | ISO 8601 timestamp or null |
| `category` | `string \| null` | Event category (e.g., "Sports", "Politics") |

### NormalizedEventMarket
Market data normalized for event-centric view.

| Field | Type | Description |
|-------|------|-------------|
| `source` | `string` | "polymarket" or "manifold" |
| `marketId` | `string` | Unique identifier from the source |
| `outcome` | `string` | The outcome being predicted (e.g., "YES") |
| `impliedProbability` | `number` | Probability between 0.0 and 1.0 |
| `liquidity` | `number` | Volume or liquidity metric |
| `lastUpdated` | `string` | ISO 8601 timestamp of last update |
| `rawPayload` | `object` | The original raw data from the provider |

### EventAggregate
Aggregated statistics across all markets for an event.

| Field | Type | Description |
|-------|------|-------------|
| `liquidityWeightedProbability` | `number` | Probability weighted by market liquidity |
| `probabilityVariance` | `number` | Variance in probabilities across markets |
| `marketCount` | `number` | Number of markets for this event |

