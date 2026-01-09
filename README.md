# Prediction Market Aggregator

A cross-market prediction market system that aggregates Polymarket-style venues and normalizes odds, liquidity, and probability signals for research, analytics, and automated decision-making.

This project treats prediction markets as **information systems**, not betting UIs.

---

## Overview

Prediction markets fragment information across venues:
- different pricing models
- inconsistent liquidity signals
- incompatible APIs
- opaque market metadata

This aggregator ingests multiple prediction markets and exposes a **normalized, queryable view** of global belief, conviction, and capital flow.

The goal: make prediction markets usable as inputs to
- research
- trading strategies
- governance signals
- automated agents

---

## What This Demonstrates

- Cross-market data normalization
- Market metadata reconciliation (outcomes, resolution criteria)
- Probability extraction and calibration
- Liquidity-weighted signal aggregation
- Event-driven ingestion pipelines
- Systems thinking over UI-first design

This is **infrastructure**, not a frontend-heavy app.

---

## Supported & Targeted Markets

Initial / Planned integrations:

- **Polymarket**
- **Kalshi**
- **Manifold Markets**
- **Augur**
- **PredictIt** (where accessible)
- Aggregation APIs (PolyRouter, Propheseer, FinFeedAPI)

Each adapter maps venue-specific concepts into a shared internal schema.

---

## Core Capabilities

### 1. Market Normalization

Different markets express probabilities differently:
- AMM prices
- orderbook midpoints
- implied odds

The system converts all inputs into:
- normalized probabilities
- confidence intervals
- liquidity-adjusted weights

---

### 2. Liquidity & Signal Weighting

Not all probabilities are equal.

Signals are weighted by:
- available liquidity
- bid–ask spread
- market depth
- recent volume

This avoids naive averaging.

---

### 3. Cross-Market Comparison

Answer questions like:
- where do markets disagree?
- which venue leads price discovery?
- which outcomes are underpriced across venues?

Useful for research and arbitrage detection (execution optional).

---

### 4. Event-Centric Views

Markets are grouped by **real-world event**, not platform.

Example:
> “2024 US Election” → dozens of markets → one unified belief surface

---

### 5. Programmatic Access

Designed API-first:
- REST / WebSocket outputs
- historical snapshots
- live updates
- machine-consumable responses

No scraping-driven UI logic.

---

## High-Level Architecture

```

┌────────────┐
│  Markets   │
│ (Adapters) │
└─────┬──────┘
│
┌─────▼──────┐
│ Ingestion  │  ← polling + streaming
└─────┬──────┘
│
┌─────▼──────┐
│ Normalizer │  ← odds, liquidity, metadata
└─────┬──────┘
│
┌─────▼──────┐
│ Aggregator │  ← weighting, signal synthesis
└─────┬──────┘
│
┌─────▼──────┐
│ API Layer  │  ← research, trading, dashboards
└────────────┘

```

Each layer is replaceable and independently testable.

---

## Use Cases

- Macro research & forecasting
- Crypto governance signal extraction
- Automated trading bots
- Market efficiency analysis
- Academic / social science research
- On-chain agent inputs

---

## Tech Stack

- **TypeScript / Node.js** — ingestion + normalization
- **Adapters per venue** — isolated API logic
- **PostgreSQL / Time-series DB** — historical storage
- **REST / WS APIs** — external consumers
- Optional execution layer (out of scope by default)

No chain dependence required.

---

## Non-Goals

- Gambling UI
- Custody or wagering
- Regulatory arbitrage
- Yield gimmicks

This is a **signal aggregation engine**, not a casino.

---

## Why This Exists

Prediction markets are one of the few places where:
- incentives are aligned
- beliefs are priced
- errors are punished

But the data is fragmented.

This project makes that data usable.

---

## Status

Active development.  
Initial focus: correctness, normalization, and system design over polish.

---

## Disclaimer

For research and infrastructure purposes only.  
No financial advice. No wagering functionality included.

```
