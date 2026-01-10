# Prediction Market Aggregator — Backend

## Overview
This service ingests data from Polymarket and Kalshi and normalizes markets into a shared format.

## Endpoints
- `GET /markets/kalshi` - Returns normalized Kalshi markets
- `GET /markets/polymarket` - Returns normalized Polymarket markets
- `GET /markets/all` - Returns combined list from both sources

## Running
1. Copy `.env.example` to `.env`
2. Set API keys for Kalshi and Polymarket (optional for public endpoints but recommended)
3. `npm install`
4. `npm run dev`

## Tech Stack
- Node.js
- Express
- TypeScript
