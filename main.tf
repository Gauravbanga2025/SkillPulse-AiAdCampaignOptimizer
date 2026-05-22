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

provider "docker" {}

provider "kubernetes" {
  config_path = "~/.kube/config"
}
      }
    }
  }
}

# ==========================================
# AI ENGINE (OLLAMA)
# ==========================================

resource "kubernetes_deployment" "ai_engine" {

  metadata {
    name      = "adoptimizer-ai"
    namespace = "default"

    labels = {
      app = "adoptimizer-ai"
    }
  }

  spec {

    replicas = 1

    selector {
      match_labels = {
        app = "adoptimizer-ai"
      }
    }

    template {

      metadata {
        labels = {
          app = "adoptimizer-ai"
        }
      }

      spec {

        container {

          name  = "ollama"
          image = "ollama/ollama:latest"

          port {
            container_port = 11434
          }

          resources {

            requests = {
              cpu    = "100m"
              memory = "256Mi"
            }

            limits = {
              cpu    = "500m"
              memory = "1Gi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "ollama_service" {

  metadata {
    name      = "ollama"
    namespace = "default"
  }

  spec {

    selector = {
      app = "adoptimizer-ai"
    }

    port {
      protocol    = "TCP"
      port        = 11434
      target_port = 11434
    }

    type = "ClusterIP"
  }
}

# ==========================================
# BACKEND
# ==========================================

resource "kubernetes_deployment" "backend" {

  metadata {
    name      = "adoptimizer-backend"
    namespace = "default"

    labels = {
      app = "adoptimizer-backend"
    }
  }

  spec {

    replicas = 1

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

          args = [
            "node",
            "dist/index.js"
          ]

          port {
            container_port = 8080
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          env {
            name  = "OLLAMA_HOST"
            value = "http://ollama:11434"
          }

          env {
            name  = "OLLAMA_URL"
            value = "http://ollama:11434"
          }

          env {
            name  = "HOST"
            value = "0.0.0.0"
          }

          env {
            name  = "PORT"
            value = "8080"
          }

          env {
            name  = "DATABASE_URL"
            value = "file:/app/data/production.db"
          }

          volume_mount {
            name       = "db-storage"
            mount_path = "/app/data"
          }

          liveness_probe {

            http_get {
              path = "/health"
              port = 8080
            }

            initial_delay_seconds = 30
            period_seconds        = 10
          }

          resources {

            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }

            limits = {
              cpu    = "300m"
              memory = "512Mi"
            }
          }
        }

        volume {

          name = "db-storage"

          empty_dir {}
        }
      }
    }
  }

  depends_on = [
    kubernetes_deployment.ai_engine,
  ]
}

resource "kubernetes_service" "backend_service" {

  metadata {
    name      = "api"
    namespace = "default"
  }

  spec {

    selector = {
      app = "adoptimizer-backend"
    }

    port {
      protocol    = "TCP"
      port        = 8080
      target_port = 8080
    }

    type = "ClusterIP"
  }
}

# ==========================================
# HPA
# ==========================================

resource "kubernetes_horizontal_pod_autoscaler" "backend_autoscaler" {

  metadata {
    name      = "backend-autoscaler"
    namespace = "default"
  }

  spec {

    min_replicas = 1
    max_replicas = 3

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.backend.metadata[0].name
    }

    target_cpu_utilization_percentage = 70
  }
}

# ==========================================
# FRONTEND
# ==========================================

resource "kubernetes_deployment" "frontend" {

  metadata {
    name      = "adoptimizer-frontend"
    namespace = "default"

    labels = {
      app = "adoptimizer-frontend"
    }
  }

  spec {

    replicas = 2

    selector {
      match_labels = {
        app = "adoptimizer-frontend"
      }
    }

    template {

      metadata {
        labels = {
          app = "adoptimizer-frontend"
        }
      }

      spec {

        container {

          name  = "web"
          image = "gauravbanga/adoptimizer-frontend:latest"

          port {
            container_port = 3000
          }

          env {
            name  = "NEXT_PUBLIC_API_URL"
            value = "http://172.105.36.248:8080"
          }

          env {
            name  = "API_URL"
            value = "http://api:8080"
          }

          env {
            name  = "BACKEND_URL"
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

          resources {

            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }

            limits = {
              cpu    = "300m"
              memory = "512Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend_service" {

  metadata {
    name      = "web-service"
    namespace = "default"
  }

  spec {

    selector = {
      app = "adoptimizer-frontend"
    }

    port {
      protocol    = "TCP"
      port        = 3000
      target_port = 3000
      node_port   = 30000
    }

    type = "NodePort"
  }
}
