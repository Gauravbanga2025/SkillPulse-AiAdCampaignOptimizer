terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23.0"
    }
  }
}

# Provider configurations
provider "docker" {}

provider "kubernetes" {
  config_path = "~/.kube/config" # 🔑 Direct link to your active KIND cluster
}

# 1. THE BACKEND DEPLOYMENT (Replaces your old YAML entirely)
resource "kubernetes_deployment" "backend" {
  metadata {
    name = "adoptimizer-backend"
    labels = {
      app = "adoptimizer-backend"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "adoptimizer-backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "adoptimizer-backend"
        }
      }

      spec {
        container {
          name  = "api"
          image = "gauravbanga/adoptimizer-backend:latest"
          # 🔑 Force the container to run production start instead of the Dockerfile's dev default
          args = ["npm", "run", "start"]
          port {
            container_port = 8080
          }
        }
      }
    }
  }
}

# 2. THE HORIZONTAL POD AUTOSCALER (HPA managed via IaC)
resource "kubernetes_horizontal_pod_autoscaler" "backend_autoscaler" {
  metadata {
    name = "backend-autoscaler"
  }

  spec {
    max_replicas = 6
    min_replicas = 2

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.backend.metadata[0].name # 🔗 Securely linked to the deployment above
    }

    target_cpu_utilization_percentage = 70
  }
}

# 3. THE FRONTEND DEPLOYMENT (Aligned with cluster state)
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "adoptimizer-frontend"
    namespace = "default"
    labels = {
      app = "frontend" # 🔑 Changed from adoptimizer-frontend
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "frontend" # 🔑 Changed from adoptimizer-frontend
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend" # 🔑 Changed from adoptimizer-frontend
        }
      }

      spec {
        container {
          name  = "web" # 🔑 Changed from frontend
          image = "gauravbanga/adoptimizer-frontend:latest"

          port {
            container_port = 3000
          }

          # 🔑 Re-adding the missing production environment variables
          env {
            name  = "NEXT_PUBLIC_API_URL"
            value = "http://172.105.36.248:8080"
          }
          env {
            name  = "API_URL"
            value = "http://api:8080"
          }
          env {
            name  = "HOST"
            value = "0.0.0.0"
          }
          env {
            name  = "PORT"
            value = "3000"
          }
        }
      }
    }
  }
}

# 4. THE AI WORKER ENGINE (Aligned with cluster state)
resource "kubernetes_deployment" "ai_engine" {
  metadata {
    name      = "adoptimizer-ai"
    namespace = "default"
    labels = {
      app = "ai" # 🔑 Changed from adoptimizer-ai
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "ai" # 🔑 Changed from adoptimizer-ai
      }
    }

    template {
      metadata {
        labels = {
          app = "ai" # 🔑 Changed from adoptimizer-ai
        }
      }

      spec {
        container {
          name  = "ollama" # 🔑 Changed from ai-model
          image = "ollama/ollama:latest" # 🔑 Changed from gauravbanga/adoptimizer-ai:latest

          port {
            container_port = 11434
          }
        }
      }
    }
  }
}
