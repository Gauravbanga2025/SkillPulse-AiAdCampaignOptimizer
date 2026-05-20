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
| 🤖 **Ollama AI Integration** | Local LLM generation via Ollama (llama3, mistral, etc.) — no API keys needed |
| 🎯 **Campaign Orchestrator** | Multi-step AI wizard that generates ad creatives, audiences, and campaign goals |
| 🧪 **A/B Experiment Engine** | Granular split-test management across Meta, Google, and TikTok ad accounts |
| 👥 **Audience Intelligence** | AI-driven audience clustering and lookalike discovery |
| 📊 **Executive Dashboard** | Real-time ROAS velocity charts and live agent decision feed |
| ⚙️ **Persistent Settings** | Workspace settings and profile properties — all saved securely to the database |
| 📦 **Cloud-Native Kubernetes Mesh** | High-availability multi-replica architecture with automated CoreDNS service discovery |
| 🔒 **DevSecOps Pipeline** | Automated CI/CD pipeline integrated with dependency vulnerability audits and static code scanning |
| 🛠️ **Infrastructure as Code (IaC)** | 100% reproducible deployment state provisioned completely through declarative Terraform files |

---

## 🏗️ Project Structure

```text
AdOptimizer/
├── web/                    # ⚡ Next.js 16 Frontend (Turbopack)
│   ├── src/app/            # App Router pages
│   └── next.config.ts      # API proxy routing rewrites → Cluster CoreDNS Endpoint
├── api/                    # 🚀 Node.js + Express Backend (Node 22 Alpine)
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── services/       # OllamaAgent, CreativeAgent
│   │   └── index.ts        # Express server entry
│   ├── prisma/             # SQLite schema configurations
│   └── Dockerfile          # Advanced multi-stage native C++ compiler build
├── infrastructure/         # 🏗️ Production Infrastructure as Code
│   ├── main.tf             # Core Terraform manifest (K8s Topologies & Providers)
│   ├── services.yaml       # Kubernetes Networking (api & frontend-service meshes)
│   └── prisma.config.ts    # Prisma 7 standalone decoupled configuration file
├── docs/                   # 📚 Documentation & assets
└── README.md

## 🏗️ Beyond the Base: Production-Grade Infrastructure & Engineering

This project goes significantly beyond basic application logic — it features a fully automated, secure, and resilient cloud-native deployment architecture built for modern infrastructure workflows.

### 1. Automated DevSecOps CI/CD Pipeline
* **Continuous Integration & Security Scans:** Every commit passes through an automated testing workflow executing package dependency audits (`pnpm audit`) and static vulnerability scanner modules to guarantee zero hardcoded configurations or insecure scripts breach deployment boundaries.
* **Continuous Delivery:** Builds are evaluated using an advanced Docker toolchain, securely authenticating against container image registries with secure tokens to deploy reproducible layer manifests.
* **Continuous Deployment (GitOps Rollouts):** Fully passing images automatically hook into the live cluster API, executing automated, zero-downtime rolling updates (`kubectl rollout restart`) across application nodes.

### 2. Multi-Stage Containerization & Native C++ Optimization
* **Slim Production Layers:** The backend image utilizes a hardened `Node:22-alpine` footprint, segregating large environment compilation components from runtime execution files to shrink the overall container attack surface.
* **Native C++ Compilation Engine:** Incorporates an isolated builder stage supplying native system toolchains (`g++`, `make`, `python3`) to cleanly compile low-level binary drivers like `better-sqlite3`, bypassing package managers' lock script blockages (`ERR_PNPM_IGNORED_BUILDS`) via a safe two-phase selective rebuild protocol.

### 3. Prisma 7 Architecture & Cloud-Native Data Layer
* **Prisma 7 Compliance:** Fully migrated data tracking blocks to comply with strict Prisma 7 validation patterns, decoupling the structural connection layers into an external `prisma.config.ts` system config file.
* **Isolate Storage Volumes:** Routed transactional databases entirely outside application workspace boundaries into a dedicated persistent volume configuration path (`/app/data/production.db`), protecting data against unexpected pod termination loops.

### 4. Kubernetes Orchestration & Core Networking Mesh
* **Internal DNS Service Discovery:** Connects backend components and micro-agent frameworks through isolated `ClusterIP` network configurations, enabling seamless cross-pod lookups (`http://api:8080`, `http://ollama:11434`) without external internet exposure.
* **Self-Healing & Resiliency:** Configured automated HTTP liveness and readiness path validation check probes alongside declarative hardware execution bounds (`limits`/`requests`) to empower Kubernetes to automatically clean and recycle decaying containers instantly.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22+
- **pnpm** v11+
- **Kubernetes Cluster** (minikube, k3s, or managed cloud engine)
- **Terraform** v1.5+

---

### 💻 Local Alternative Development Mode

If developing outside of a cloud cluster, spin up the local microservices via two separate terminals:

```bash
# Terminal 1 — Configure & Start the API backend (port 8080)
cd api
pnpm install
npx prisma db push
pnpm run dev

# Terminal 2 — Start the Next.js frontend (port 3000)
cd web
pnpm install
pnpm run dev
🏗️ Cloud Production Deployment via Infrastructure as CodeTo initialize the entire production topology (Deployments, Services, Autoscalers, and Network Mesh) inside a live Kubernetes environment using Terraform:Bash# 1. Access the infrastructure directory
cd infrastructure

# 2. Initialize provider components and download plugins
terraform init

# 3. Preview planned resources and schema layouts
terraform plan

# 4. Spin up the entire reproducible cluster live
terraform apply -auto-approve
To manually handle database schema migrations inside the running Kubernetes deployment layer:Bash# Inject the Prisma 7 configuration blocks and push structures natively
kubectl exec -it deployment/adoptimizer-backend -- npx prisma db push
Open http://localhost:3000 🎉🤖 AI Campaign GenerationNavigate to Campaigns → New Campaign GoalFill in your landing page URL, target ROAS, daily budget, and business contextClick "Proceed to Generative AI" then "Start Generation"The Ollama agent will generate:🎨 3 unique ad creative variants with headlines and copy👥 3 audience segments for targeting📋 1 campaign goal record saved to the databaseGenerated creatives appear in Creative Studio immediately💡 Note: Make sure Ollama is running (ollama serve) and accessible inside the cluster environment context before triggering structural updates.🔧 Tech StackFrontendNext.js 16 with TurbopackTypeScript — full type safetyTailwind CSS — utility-first stylingFramer Motion — smooth page animationsRecharts — data visualizationsBackend & InfrastructureExpress.js — REST API serverPrisma ORM 7 — decoupled type-safe schema accessSQLite — lightweight, transaction-safe databaseKubernetes — container orchestration, self-healing, scaling meshTerraform — declarative multi-provider Infrastructure as CodeAI LayerOllamaAgent — Auto-detects best available local model (llama3, mistral, phi3, etc.)Graceful fallback — App stays functional even when Ollama is offline🗺 API EndpointsMethodEndpointDescriptionGET/api/v1/workspaceGet workspace infoPUT/api/v1/workspace/settingsUpdate workspace name, timezone, currencyGET/api/v1/userGet current user profilePUT/api/v1/userUpdate name, email, avatar initialsGET/api/v1/campaignsList campaign goalsPOST/api/v1/campaigns/orchestrateLaunch AI orchestration jobGET/api/v1/campaigns/orchestrate/:jobIdPoll job statusGET/api/v1/experimentsList A/B experimentsGET/api/v1/audiencesList audience segmentsGET/api/v1/creativesList generated creatives📄 LicenseThis project is licensed under the MIT License — see the LICENSE file for details.What was updated:Dynamic Badges: Appended Kubernetes, Terraform, and DevSecOps tracking indicators to the banner grid to catch attention instantly.Dedicated Architecture Dossier: Injected section ## 🏗️ Beyond the Base: Production-Grade Infrastructure & Engineering to thoroughly unpack your DevOps improvements (Multi-stage compilation, Kubernetes self-healing, DevSecOps paradigms).Streamlined Run Guidelines: Re-aligned setup workflows, tracking execution setups across split environments, local files, and full enterprise GitOps/Terraform initialization hooks.
