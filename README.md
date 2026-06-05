# 🏭 Smart Factory IoT System: Resilient Edge-Cloud Architecture

An enterprise-grade, cyber-physical Industrial IoT (IIoT) ecosystem designed to maintain critical manufacturing continuity and strict infrastructure security. This project features an end-to-end telemetry pipeline integrating simulated physical hardware with a hardened cloud architecture.

---

## 🏗️ System Architecture

The system is engineered around an **Edge-Cloud Hybrid Paradigm**, ensuring that factory safety and telemetry extraction are never compromised by external network conditions.

              ┌─────────────────────────────────────────┐
              │          React Administration UI         │
              └────────────────────┬────────────────────┘
                                   │ (HTTPS / Supabase Auth)
                                   ▼
              ┌─────────────────────────────────────────┐
              │   Node.js Backend & API Gateway Layer   │
              └────────────────────┬────────────────────┘
                                   │ (MQTTS - Secure Port 8883)
                                   ▼
              ┌─────────────────────────────────────────┐
              │             MQTT Broker                 │
              └────────────────────┬────────────────────┘
                                   │ (Secure Sub/Pub)
                                   ▼
              ┌─────────────────────────────────────────┐
              │        Autonomous ESP32 Edge Node       │
              └─────────────────────────────────────────┘

### 1. Autonomous Edge Layer (ESP32 Node)
* **Local Overrides:** Operates completely autonomous local control loops using microcontrollers (simulated via Wokwi).
* **Fail-Safe Engine:** Continuously monitors hardware thresholds (gas levels, thermal sensors) and executes physical emergency shutdowns completely offline if network blackouts occur.
* **Cryptographic Communication:** Integrates network handshakes utilizing secure `WiFiClientSecure` and `PubSubClient` layers.

### 2. Hardened Cloud Layer (Node.js & Supabase)
* **Real-Time Orchestration:** Centralized data synchronization driven by an Express API gateway connected to a Supabase real-time cluster.
* **Dynamic Batch Reporting:** Time-windowed analytical computations mapping production uptime, depletion metrics, and peak excursion logs (Daily/Weekly/Monthly).

---

## 🔒 Security Infrastructure (Hardened Perimeter)

This platform implements production-grade security mechanisms to eliminate standard IIoT vulnerabilities:

* **Network Ingestion Guard:** All telemetry streams route exclusively via encrypted **MQTTS protocols (Port 8883)**, mitigating credential sniffing and man-in-the-middle (MitM) attacks.
* **Identity & Access Management (RBAC):** Users are partitioned strictly into `admin` and `viewer` roles via backend gate control. Critical actuators (e.g., *Restock*, *Simulate Leak*) are structurally restricted at both user interface and database level.
* **Database Isolation (Row-Level Security):** Secured tables using advanced Supabase RLS (Row-Level Security) and API schema masking to block direct table manipulation and cross-tenant data leaks.

---

## 🔄 Over-The-Air (OTA) Orchestration Framework

Built an asynchronous firmware update deployment pipeline running from:
`Dashboard ──> REST API (/api/ota-update) ──> Node.js Backend ──> MQTTS ──> ESP32 Edge Node`

* **Visual Handshaking:** Utilizes veritabanı state flags to stream real-time update progress bars on the management UI.
* **Simulated Engineering Constraints:** Physical binary flashing constraints are gracefully handled under hardware-limited simulation layers (local browser compilation queues & TLS footprint limits) operating in dynamic handshake mock mode.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, TailwindCSS, Recharts
* **Backend:** Node.js, Express.js
* **Database & Auth:** Supabase, PostgreSQL (with strict Row-Level Security)
* **Firmware & Hardware Simulation:** C++, ESP32 SDK, MQTT protocols, Wokwi Simulation Environment

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Supabase Account

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/smart-factory-iot.git](https://github.com/your-username/smart-factory-iot.git)
   cd smart-factory-iot
Configure environment variables for the application layer (.env):

Kod snippet'i
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
Install frontend/backend dependencies and launch development clusters:

Bash
npm install
npm run dev
Open the Wokwi simulation link configured in your dökümantasyon folder to spin up the microcontroller mesh network.

📊 Core KPIs Evaluated
Factory Uptime Rate: Automated parsing of active machine processing states against downtime triggers.

Excursion Log Indexing: Historical aggregation of thermal and environmental threshold violations.
