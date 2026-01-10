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
