# CitySense AI – Road Intelligence Platform Plan

## 1. Vision & Success Metrics
- **Goal:** turnkey platform that turns passive mobility data into actionable infrastructure insights for government and fleet partners.
- **Primary KPIs:** damage detection precision/recall ≥ 0.9, SLA < 2 s per inference, dashboard MAU, number of active pilot kilometers, lead-to-contract conversion.

## 2. Repository Blueprint
```
├── data-ingestion/        # Kafka consumers, ETL jobs, schema registry
├── data-labelling/        # Annotation tooling configs, guidelines, scripts
├── ml/                    # Training code, experiments, notebooks, model cards
├── services/inference/    # Real-time gRPC/REST model serving
├── services/api/          # Aggregation API + auth + billing
├── dashboard/             # React/Mapbox console + investor demo
├── infra/                 # Terraform + Helm charts, monitoring, CI/CD
└── docs/                  # Architecture, checklists, playbooks
```

## 3. Data Strategy
| Layer | Responsibilities | Tech Stack |
| --- | --- | --- |
| **Sources** | Dashcam, IMU, GPS, pollution sensors, user feedback | Telematics SDK, CSV/JSON uploads |
| **Transport** | Secure ingestion, de-duplication | MQTT→Kafka, S3 landing zone |
| **Storage** | Raw + curated zones | S3 + Iceberg, PostGIS for spatial queries |
| **Catalog & Quality** | Schema registry, drift checks | OpenMetadata, Great Expectations |

**Actions**
1. Define protobuf schemas for trip_event, sensor_frame, citizen_report.
2. Stand up Kafka topics per city with ACLs; enforce data retention policies.
3. Nightly compaction jobs to convert raw blobs into parquet partitions keyed by city/date/road_segment.

## 4. Labeling & Experimentation
- **Annotation:** CVAT + SAM assisted masks; weak supervision using accelerometer spikes + crowd reports.
- **Label taxonomy:** `pothole`, `crack`, `rutting`, `speed_breaker`, `faded_lane`, `bus_delay`, `pollution_hotspot`.
- **Experiment tracking:** MLflow + Weights & Biases for metrics, Hydra configs for reproducibility.
- **Data splits:** geo-stratified (train/val/test by municipality) to avoid leakage.

## 5. Modeling Stack
| Problem | Baseline | Stretch |
| --- | --- | --- |
| Road-surface segmentation | EfficientNet encoder + DeepLabV3+ | U-Net++ with SAM embeddings, ONNX export |
| Damage detection | YOLOv8/RT-DETR | Multi-modal transformer combining video + IMU |
| Behavior scoring | Gradient boosted trees on telematics features | Temporal GNN on driver trips |
| Pollution inference | Kriging + Bayesian fusion | Physics-informed neural nets |

**Serving:** TorchServe or Triton with A/B routing; convert to ONNX/TensorRT for edge deployment.

## 6. Backend & APIs
- **Inference API:** gRPC gateway -> FastAPI/Go service, auth via JWT + API keys.
- **Aggregation service:** scheduled jobs to compute per-road severity indices, fleet scorecards, and export GeoJSON/vector tiles.
- **Billing/events:** Each scan emits `billing.record.created` to Stripe/Billing service.

## 7. Frontend & Investor Demo
- React + Mapbox GL showing:
  - Live detections heatmap
  - Bus timeline, delay causes
  - Pollution corridor overlays
  - Ticket export (CSV/PDF)
- Provide read-only “demo tenant” with synthetic-but-realistic data refreshed nightly.

## 8. DevOps & Observability
- GitHub Actions: lint/test, model training on GPU runners, automated container builds.
- Terraform EKS cluster; Helm charts for Kafka, Postgres/PostGIS, inference pods, Prometheus/Grafana, Loki.
- Monitoring SLIs: inference latency, GPU utilization, false-positive rate, data drift scores, dashboard uptime.
- Incident playbooks in `docs/runbooks/`.

## 9. Security & Compliance
- Pseudonymize license plates/faces via on-device blurring.
- Encrypt in transit (mTLS) and at rest (KMS); audit logs piped to SIEM.
- Data retention per city contract, GDPR-style “right to delete”.

## 10. Rollout Plan
1. **Month 0–1:** Stand up ingestion + storage skeleton, create synthetic dataset, ship investor dashboard MVP.
2. **Month 2–3:** Collect pilot city data, label 5k frames, train V1 segmentation/detector, deploy inference API.
3. **Month 4–5:** Integrate fleet behavior scoring, launch notification workflows, onboard 2nd city.
4. **Month 6+:** Automate retraining, launch data licensing API, measure recurring revenue.

Deliverables per milestone should include demos, metrics, updated docs, and signed-off model cards.
