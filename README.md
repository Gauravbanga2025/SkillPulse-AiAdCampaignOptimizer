<div align="center">
  <h1>⚡ AdOptimizer</h1>
  <p><strong>AI-Powered Ad Campaign Orchestration Platform</strong></p>
  <p>Autonomously generate, test, and optimize advertising creatives powered by local AI (Ollama) and a multi-agent orchestration loop.</p>
    
<div align="center"> 

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs" />
<img src="https://img.shields.io/badge/Prisma_7-SQLite-2D3748?style=for-the-badge&logo=prisma" />
<img src="https://img.shields.io/badge/Kubernetes-Production_Ready-326CE5?style=for-the-badge&logo=kubernetes" />
<img src="https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform" />
<img src="https://img.shields.io/badge/DevSecOps-CI_CD-FF6B6B?style=for-the-badge" />

</div>
</div>

---

### 📊 Executive Dashboard
![Executive Dashboard](docs/assets/dashboard.png)

### 🎯 Campaign Goals
![Campaign Goals](docs/assets/campaigns.png)

### 🤖 AI Campaign Wizard
![AI Campaign Wizard](docs/assets/new_campaign.png)

### 🧪 Active Experiments
![Active Experiments](docs/assets/experiments.png)

### 👥 Audience Intelligence
![Audience Intelligence](docs/assets/audiences.png)

### 🎨 Creative Studio
![Creative Studio](docs/assets/creatives.png)

### ⚙️ Platform Settings
![Platform Settings](docs/assets/settings.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Ollama AI Integration** | Local LLM generation via Ollama (Qwen) — no API keys needed |
| 🎯 **Campaign Orchestrator** | Multi-step AI wizard that generates ad creatives, audiences, and campaign goals |
| 🧪 **A/B Experiment Engine** | Granular split-test management across Meta, Google, and TikTok ad accounts |
| 👥 **Audience Intelligence** | AI-driven audience clustering and lookalike discovery |
| 📊 **Executive Dashboard** | Real-time ROAS velocity charts and live agent decision feed |
| ⚙️ **Persistent Settings** | Workspace settings and profile properties — all saved securely to the database |
| 📦 **Cloud-Native Kubernetes Mesh** | High-availability multi-replica architecture with automated CoreDNS service discovery |
| 🔒 **DevSecOps Pipeline** | Automated CI/CD pipeline integrated with dependency vulnerability audits and static code scanning |
| 🛠️ **Infrastructure as Code (IaC)** | 100% reproducible deployment state provisioned completely through declarative Terraform files |

---

Table of Contents

Project Structure
Tech Stack
Getting Started
Cloud Deployment via Terraform
AI Campaign Generation
API Endpoints
Infrastructure & Engineering


Project Structure
AdOptimizer/
├── web/                        # Next.js 16 Frontend (Turbopack)
│   ├── src/app/                # App Router pages
│   └── next.config.ts          # API proxy routing → Cluster CoreDNS endpoint
├── api/                        # Node.js + Express Backend (Node 22 Alpine)
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   ├── services/           # OllamaAgent, CreativeAgent
│   │   └── index.ts            # Express server entry
│   ├── prisma/                 # SQLite schema
│   └── Dockerfile              # Multi-stage native C++ compiler build
├── infrastructure/             # Infrastructure as Code
│   ├── main.tf                 # Terraform manifest (K8s deployments, services, HPA)
│   ├── services.yaml           # Kubernetes networking manifests
│   └── prisma.config.js        # Prisma 7 decoupled datasource configuration
├── docs/                       # Documentation & assets
└── README.md

Tech Stack
Frontend

Next.js 16 with Turbopack, TypeScript, Tailwind CSS
Framer Motion, Recharts, React Hot Toast

Backend

Express.js REST API, Prisma ORM 7, SQLite via @prisma/adapter-better-sqlite3
Ollama HTTP API for local AI model inference

Infrastructure

Kubernetes — container orchestration, self-healing, scaling mesh
Terraform — declarative multi-provider Infrastructure as Code
Docker — multi-stage native C++ compilation pipeline

AI Layer

OllamaAgent — auto-detects and triggers the local Qwen model
Graceful fallback — app stays functional when Ollama is offline


Getting Started
Prerequisites

Node.js v22+
pnpm v11+
Kubernetes cluster (minikube, k3s, or managed cloud)
Terraform v1.5+
Ollama running locally with the Qwen model

bashollama pull qwen
Local Development
Terminal 1 — Backend (port 8080)
bashcd api
pnpm install
npx prisma db push
pnpm run dev
Terminal 2 — Frontend (port 3000)
bashcd web
pnpm install
pnpm run dev
Open http://localhost:3000

Cloud Deployment via Terraform
Provisions the entire production topology — deployments, services, autoscalers, persistent volumes, and network mesh — in a single command.
bash# 1. Navigate to infrastructure directory
cd infrastructure

# 2. Initialize providers and download plugins
terraform init

# 3. Preview planned resources
terraform plan

# 4. Spin up the entire cluster
terraform apply -auto-approve
To initialize the database schema in the running cluster:
bashkubectl exec -it deployment/adoptimizer-backend -- npx prisma db push

AI Campaign Generation

Navigate to Campaigns → New Campaign Goal
Fill in your landing page URL, target ROAS, daily budget, and business context
Click "Proceed to Generative AI" → "Start Generation"

The Ollama agent generates:

🎨 3 unique ad creative variants with headlines and copy
👥 3 audience segments for targeting
📋 1 campaign goal record saved to the database

Generated creatives appear in Creative Studio immediately.

Note: Ensure Ollama is running (ollama serve) and the qwen model is available before starting generation.


API Endpoints
MethodEndpointDescriptionGET/api/v1/workspaceGet workspace infoPUT/api/v1/workspace/settingsUpdate workspace name, timezone, currencyGET/api/v1/userGet current user profilePUT/api/v1/userUpdate name, email, avatar initialsGET/api/v1/campaignsList campaign goalsPOST/api/v1/campaigns/orchestrateLaunch AI orchestration jobGET/api/v1/campaigns/orchestrate/:jobIdPoll job statusGET/api/v1/experimentsList A/B experimentsGET/api/v1/audiencesList audience segmentsGET/api/v1/creativesList generated creatives

Infrastructure & Engineering
Terraform-Managed Kubernetes Topology
The entire production infrastructure is defined as code in main.tf using the hashicorp/kubernetes and kreuzwerker/docker providers. Terraform provisions and manages:

Backend deployment — 2 replicas with liveness probes, resource limits, and a mounted PersistentVolumeClaim for SQLite persistence across pod restarts
Frontend deployment — 2 replicas with environment-injected API routing
AI engine (Ollama) — dedicated single-replica deployment with memory bounds
ClusterIP services — internal DNS mesh (http://api:8080, http://ollama:11434) for zero-internet-exposure pod-to-pod communication
NodePort service — external frontend access on port 30000
HorizontalPodAutoscaler — CPU-based autoscaling (2–6 replicas) at 70% threshold

Multi-Stage Containerization & Native C++ Compilation
The backend Dockerfile implements an advanced multi-stage build pipeline to solve native C++ module compilation inside Alpine containers. Build tools (g++, make, python3) are isolated to the builder stage alongside a two-phase pnpm install strategy (--ignore-scripts + selective pnpm rebuild) to bypass pnpm 11's new security-enforced build script allowlist (ERR_PNPM_IGNORED_BUILDS). The production stage retains only runtime artifacts, minimizing the container attack surface.
Prisma 7 Migration & Data Layer
Fully migrated to Prisma 7, which introduced breaking changes — datasource URLs removed from schema.prisma, new prisma.config.js module pattern, and adapter API changes (BetterSqlite3Adapter → PrismaBetterSqlite3). Automated schema sync (prisma db push) runs on every pod startup, ensuring self-initializing database state with no manual intervention. Database files are routed to a dedicated volume path (/app/data/production.db), decoupled from application code.
Self-Healing & Observability
HTTP liveness probes on /health enable Kubernetes to automatically detect and recycle unhealthy containers. Resource requests and limits are defined for all workloads, preventing noisy-neighbour resource starvation across the cluster.
