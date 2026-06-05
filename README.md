# 🏭 Smart Factory IoT System
### *Resilient Edge-Cloud Architecture & Hardened IIoT Ecosystem*

<div align="center">

![GitHub top language](https://img.shields.io/github/languages/top/your-username/smart-factory-iot?color=blueviolet&style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/your-username/smart-factory-iot?color=darkgreen&style=for-the-badge)
![Supabase](https://img.shields.io/badge/Database-Supabase-blue?style=for-the-badge&logo=supabase)
![MQTT](https://img.shields.io/badge/Protocol-MQTTS-orange?style=for-the-badge&logo=mqtt)
![Security](https://img.shields.io/badge/Security-RLS%20Hardened-red?style=for-the-badge)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-security-infrastructure">Security</a> •
  <a href="#-ota-framework">OTA Framework</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

</div>

---

## 🌟 Overview

This repository contains an enterprise-grade, cyber-physical **Industrial IoT (IIoT)** ecosystem. It is engineered around a novel **Edge-Cloud Hybrid Paradigm**, ensuring that factory safety, telemetry extraction, and automated control loops remain 100% operational even during complete network blackouts.

---

## 🚀 Key Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **Autonomous Edge Control** | ESP32 manages threshold checks & emergency shutdowns completely offline. | ✅ Active |
| **MQTTS Encryption** | End-to-end payload encryption via secure port 8883 to prevent MITM. | 🔒 Hardened |
| **Role-Based Access (RBAC)** | Dynamic employee provisioning with strict Admin/Viewer partitioning. | 👥 Enforced |
| **Dynamic Batch Reporting** | Time-windowed telemetry computations (Daily, Weekly, Monthly KPIs). | 📈 Integrated |
| **Asynchronous OTA Framework** | Full-stack firmware deployment pipeline with UI-synchronized progress bars. | 🔄 Documented |

---

## 🏗️ System Architecture

Our robust communication pipeline ensures seamless visual synchronization and local reliability:

                  ┌─────────────────────────────────────────┐
                  │        React Administration UI          │
                  └────────────────────┬────────────────────┘
                                       │ (HTTPS / Supabase Auth)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │   Node.js Backend & API Gateway Layer   │
                  └────────────────────┬────────────────────┘
                                       │ (MQTTS - Secure Port 8883)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │               MQTT Broker               │
                  └────────────────────┬────────────────────┘
                                       │ (Secure Sub/Pub)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │        Autonomous ESP32 Edge Node       │
                  └─────────────────────────────────────────┘

### 🛰️ 1. Edge Layer (ESP32 Node)
* **Local Safety Interventions:** Processes live telemetry (potentiometer speed, gas level, temperature) inside offline microcontrollers.
* **Fail-Safe Mechanism:** Instantly triggers isolation protocols if critical thresholds are breached while internet connection is lost.

### ☁️ 2. Cloud Layer (Node.js & Supabase)
* **API Introspection:** Express.js routing structures handle dashboard handshakes.
* **Real-Time Synchronisation:** Supabase backend aggregates incoming telemetry and tracks physical anomalies instantly.

---

## 🔒 Security Infrastructure (Hardened Perimeter)

We implemented defense-in-depth methodologies to mitigate common industrial vector attacks:

* **Data Ingestion Guard:** Telemetry payloads route exclusively over **TLS-encrypted MQTT (Port 8883)**. This blocks credential sniffing on the factory floor.
* **Database Isolation:** Enforced strict PostgreSQL **Row-Level Security (RLS)** rules. Frontend actors cannot bypass schemas, preventing direct database manipulation or privilege escalation.
* **Gated Control Interfaces:** Critical actuation vectors like `"Restock"` or `"Simulate Leak"` are completely hidden and API-locked for `viewer` operators.

---

## 🔄 Over-The-Air (OTA) Orchestration Framework

The asynchronous deployment pipeline targets automatic node management:
`Dashboard ──> REST API (/api/ota-update) ──> Node.js Backend ──> MQTTS ──> ESP32 Edge Node`

> ⚠️ **Mengineering Analysis & Constraints:** Physical binary flashing phase constraints are gracefully cataloged under hardware-limited simulation layers (local browser compilation queues & TLS RAM footprints within the Wokwi engine) operating in a verified state-flag mock synchronization mode.

---

## 🛠️ Tech Stack

* **Frontend:** `React.js` • `TailwindCSS` • `Recharts (Dynamic Analytics)`
* **Backend:** `Node.js` • `Express.js`
* **Database:** `Supabase` • `PostgreSQL Cluster (RLS Hardened)`
* **Firmware & Simulation:** `C++` • `ESP32 SDK` • `Wokwi Environment` • `MQTTS`

---

## ⚙️ Installation & Deployment

1. **Clone & Extract Node Environment:**
   ```bash
   git clone [https://github.com/your-username/smart-factory-iot.git](https://github.com/your-username/smart-factory-iot.git)
   cd smart-factory-iot
Environment Synchronization (.env):

Kod snippet'i
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_project_anon_key
Trigger Runtime Clusters:

Bash
npm install
npm run dev
