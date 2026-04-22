---
layout: project
title: "zkProof Identity Gateway"
description: "A production-grade zero-knowledge proof system for privacy-preserving identity verification on Ethereum L2 networks."
category: ZK_SYSTEMS
status: ACTIVE
tags: [rust, circom, groth16, ethereum, identity]
github: "https://github.com/username/zkproof-gateway"
---

## Overview

The zkProof Identity Gateway enables on-chain identity verification without revealing any underlying personal data. Users prove membership in a verified set (e.g., "KYC-passed", "age ≥ 18", "accredited investor") without disclosing which set member they are.

The system uses Groth16 SNARKs over the BN254 curve, compiled from Circom circuits, with a Solidity verifier deployed on Arbitrum.

## Architecture

```
[User] ──► [Witness Generator (Rust)] ──► [Prover (snarkjs)] ──► [Proof]
                                                                      │
[Smart Contract] ◄─────────────── [Verifier.sol] ◄───────────────────┘
```

## Performance

| Operation | Time | Gas (L2) |
|-----------|------|----------|
| Witness gen | 340ms | — |
| Proof gen | 2.1s | — |
| On-chain verify | — | 185,000 |

## Setup

```bash
git clone https://github.com/username/zkproof-gateway
cd zkproof-gateway
cargo build --release
./scripts/setup.sh  # Downloads Powers of Tau ceremony
```
