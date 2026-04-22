---
layout: post
title: "Automated Anomaly Detection in Encrypted Cloud Traffic"
date: 2024-03-21
category: White_Paper
excerpt: "Leveraging Bayesian networks to identify malicious patterns within TLS 1.3 streams without decryption, maintaining total end-to-end privacy."
tags: [anomaly-detection, bayesian, tls, cloud-security, privacy]
---

## Abstract

We present a framework for detecting malicious behavioral patterns in TLS 1.3 encrypted traffic without performing decryption. By modeling packet timing, size distributions, and connection metadata as observable variables in a dynamic Bayesian network, we achieve an F1-score of 0.94 on a labeled dataset of 12 million flows, while maintaining strict end-to-end encryption guarantees.

## 1. Motivation

The widespread adoption of TLS 1.3 and encrypted DNS represents an important privacy advance for end users. However, it creates a blind spot for network defenders: traditional deep-packet inspection (DPI) techniques are rendered ineffective, and organizations lose visibility into their own infrastructure.

The core challenge is that **encryption hides content but not behavior.** A botnet C2 beacon, a data exfiltration pipeline, and a ransomware pre-encryption scan each produce distinctive patterns in:

- Inter-packet timing intervals
- Packet size histograms
- TCP flow duration and byte totals
- TLS handshake fingerprints (JA3/JA3S)
- Connection graph topology

## 2. The Bayesian Flow Model

We model each network flow $F$ as a sequence of observable random variables $X_1, X_2, \ldots, X_T$ where each $X_t$ represents a feature vector at time step $t$. The latent variable $Z$ represents the true traffic class (benign / malicious / C2 / exfiltration).

The joint probability factorizes as:

$$P(Z, X_{1:T}) = P(Z) \prod_{t=1}^{T} P(X_t \mid X_{t-1}, Z)$$

This Hidden Markov formulation allows us to compute the posterior $P(Z \mid X_{1:T})$ efficiently via the forward-backward algorithm.

### 2.1 Feature Engineering

```python
def extract_flow_features(pcap_path: str) -> dict:
    """
    Extract behavioral features without inspecting payload.
    """
    flows = parse_flows(pcap_path)
    features = {}

    for flow_id, packets in flows.items():
        sizes    = [p.length for p in packets]
        deltas   = np.diff([p.timestamp for p in packets])
        ja3      = compute_ja3(packets[0])  # TLS fingerprint

        features[flow_id] = {
            "size_mean":     np.mean(sizes),
            "size_std":      np.std(sizes),
            "size_entropy":  entropy(np.histogram(sizes, bins=32)[0]),
            "iat_mean":      np.mean(deltas),
            "iat_cv":        variation(deltas),      # coefficient of variation
            "burstiness":    burstiness_index(deltas),
            "ja3_hash":      ja3,
            "byte_ratio":    sum(p.length for p in packets if p.direction == "→") /
                             max(sum(p.length for p in packets), 1),
        }
    return features
```

## 3. Training Dataset

The model is trained on a composite dataset of:

| Source | Benign Flows | Malicious Flows | Total |
|--------|-------------|-----------------|-------|
| CICIDS-2018 | 4.2M | 1.1M | 5.3M |
| UNSW-NB15 | 2.5M | 0.8M | 3.3M |
| Internal capture | 2.9M | 0.5M | 3.4M |
| **Total** | **9.6M** | **2.4M** | **12M** |

Class imbalance is addressed via SMOTE oversampling applied only to the training partition, with a final 80/10/10 train/validation/test split stratified by flow type.

## 4. Results

Evaluation on the held-out test set (1.2M flows) produces the following metrics:

```
              precision    recall  f1-score   support

      benign       0.97      0.96      0.96    960,000
   malicious       0.91      0.93      0.92    144,000
          C2       0.94      0.92      0.93     72,000
 exfiltration      0.89      0.95      0.92     24,000

    macro avg      0.93      0.94      0.93  1,200,000
 weighted avg      0.96      0.96      0.96  1,200,000
```

The model achieves a **false positive rate of 3.8%**, which we consider acceptable for a tier-1 alerting system where analyst review filters subsequent decisions.

## 5. Deployment Architecture

The system is deployed as a sidecar process alongside the VPC flow log exporter in AWS environments. Inference runs at the flow-granularity on completion, introducing zero latency penalty to live traffic.

```
[VPC Flow Logs] ──► [S3 Buffer] ──► [Lambda: Feature Extract]
                                           │
                                           ▼
                              [SageMaker Endpoint: BN Inference]
                                           │
                                           ▼
                             [Security Hub Finding] ◄── [Threshold: P(Z=malicious) > 0.75]
```

## 6. Conclusion

Behavioral analysis of encrypted flows provides actionable threat intelligence without compromising user privacy. The Bayesian network formulation offers interpretable posteriors — a defender can inspect not just *that* a flow is anomalous, but *which features* drove the classification.

Future work will extend the model to handle QUIC/HTTP3 traffic and incorporate federated learning for cross-organization knowledge sharing without raw data exposure.
