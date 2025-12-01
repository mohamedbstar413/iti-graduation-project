# 🚀 Enterprise Multi-Tier Microservices Platform

[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io/cd/)
[![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=helm&logoColor=white)](https://helm.sh/)
[![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/)

> A production-ready, cloud-native microservices platform deployed on AWS EKS with complete GitOps automation, observability stack, and enterprise-grade security.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Components](#-components)
- [Security](#-security)
- [Monitoring & Observability](#-monitoring--observability)
- [CI/CD Pipeline](#-cicd-pipeline)
- [High Availability & Scaling](#-high-availability--scaling)
- [Contributing](#-contributing)

---
## 🎯 Runtime
<img width="1556" height="762" alt="image" src="https://github.com/user-attachments/assets/f3d8c80f-7775-46b5-b00f-422692db70b3" />
<img width="1898" height="724" alt="image" src="https://github.com/user-attachments/assets/342f83b0-881b-4ee2-9fc8-01da8ac4b615" />
<img width="1614" height="142" alt="image" src="https://github.com/user-attachments/assets/40aadc92-15da-49f4-864b-12b1c187b70d" />
<img width="1098" height="185" alt="image" src="https://github.com/user-attachments/assets/d91a1027-7882-44df-b48b-5155c0e725a5" />
<img width="1228" height="275" alt="image" src="https://github.com/user-attachments/assets/7d2222a9-d052-46e8-99c7-66b6ff1deb60" />

---

## 🎯 Overview

This project demonstrates a complete enterprise-grade Kubernetes deployment featuring:

- **3-Tier Application Architecture**: Frontend (React/NGINX) → Backend (Node.js) → Database (MySQL)
- **Infrastructure as Code**: Complete AWS infrastructure provisioned with Terraform
- **GitOps Deployment**: ArgoCD with App of Apps pattern for declarative deployment management
- **Full Observability**: Prometheus metrics collection with Grafana visualization dashboards
- **Enterprise Security**: AWS Secrets Manager integration, network policies, IRSA authentication
- **Auto-Scaling**: Both horizontal pod autoscaling (HPA) and cluster autoscaling
- **High Availability**: Multi-AZ deployment with pod anti-affinity rules

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          AWS Cloud (us-east-1)                   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    VPC (10.0.0.0/16)                        │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │  Public AZ-A │  │  Public AZ-B │  │  Public AZ-C │     │ │
│  │  │    Subnet    │  │    Subnet    │  │    Subnet    │     │ │
│  │  └──────┬───────┘  └──────────────┘  └──────────────┘     │ │
│  │         │                                                   │ │
│  │    ┌────▼────┐           ┌─────────────┐                  │ │
│  │    │   NAT   │◄──────────┤ Internet GW │                  │ │
│  │    │ Gateway │           └─────────────┘                  │ │
│  │    └────┬────┘                                             │ │
│  │         │                                                   │ │
│  │  ┌──────▼───────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Private AZ-A │  │ Private AZ-B │  │ Private AZ-C │    │ │
│  │  │   Subnet     │  │   Subnet     │  │   Subnet     │    │ │
│  │  │              │  │              │  │              │    │ │
│  │  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │    │ │
│  │  │ │EKS Nodes │ │  │ │EKS Nodes │ │  │ │EKS Nodes │ │    │ │
│  │  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    EKS Cluster Namespaces                   │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │  front-ns   │  │   back-ns   │  │    db-ns    │        │ │
│  │  │             │  │             │  │             │        │ │
│  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │        │ │
│  │  │ │ NGINX   │ │  │ │ Node.js │ │  │ │  MySQL  │ │        │ │
│  │  │ │ + React │ │  │ │   API   │ │  │ │StatefulS│ │        │ │
│  │  │ │  Pods   │ │  │ │  Pods   │ │  │ │   et    │ │        │ │
│  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │        │ │
│  │  │             │  │             │  │             │        │ │
│  │  │ LoadBalancer│  │ ClusterIP  │  │ ClusterIP   │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │  argocd-ns  │  │ jenkins-ns  │  │ kube-system │        │ │
│  │  │             │  │             │  │             │        │ │
│  │  │ ArgoCD      │  │ Jenkins     │  │ Prometheus  │        │ │
│  │  │ Server      │  │ Controller  │  │ Grafana     │        │ │
│  │  │ Image       │  │ Agents      │  │ CSI Drivers │        │ │
│  │  │ Updater     │  │             │  │ Autoscaler  │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    AWS Services Integration                 │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │   Secrets    │  │     ECR      │  │     IAM      │     │ │
│  │  │   Manager    │  │  (Container  │  │   (IRSA)     │     │ │
│  │  │              │  │  Registry)   │  │              │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🔐 Security
- **AWS Secrets Manager Integration** - Secure credential injection via CSI driver
- **IRSA (IAM Roles for Service Accounts)** - Zero-trust authentication to AWS services
- **Network Policies** - Microsegmentation and pod-to-pod access control
- **No Hardcoded Secrets** - All sensitive data externalized
- **Service Account RBAC** - Fine-grained access control

### 🔄 GitOps & Automation
- **ArgoCD App of Apps Pattern** - Declarative application management
- **Automated Image Updates** - ECR integration with ArgoCD Image Updater
- **Sync Waves** - Orchestrated resource deployment order
- **Self-Healing** - Automatic drift detection and correction
- **Jenkins CI/CD** - Automated build and deployment pipelines

### 📊 Observability
- **Prometheus** - Comprehensive metrics collection from cluster and applications
- **Grafana** - Custom dashboards for visualization and alerting
- **Health Checks** - Readiness and liveness probes for all services
- **Resource Monitoring** - CPU, memory, and network metrics tracking

### ⚡ High Availability & Scaling
- **Multi-AZ Deployment** - Distribution across 3 availability zones
- **Pod Anti-Affinity** - Workload spreading for fault tolerance
- **Horizontal Pod Autoscaling** - CPU-based auto-scaling (2-10 replicas)
- **Cluster Autoscaling** - Dynamic node provisioning
- **Load Balancing** - AWS Load Balancer Controller integration

### 🏗️ Infrastructure
- **Infrastructure as Code** - 100% Terraform-managed AWS resources
- **Helm Charts** - Parameterized, reusable deployment templates
- **Persistent Storage** - StatefulSets with PV/PVC for data persistence
- **Service Mesh Ready** - NGINX reverse proxy with path-based routing

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Container Orchestration** | Kubernetes (EKS), Docker |
| **Cloud Provider** | AWS (EKS, VPC, EC2, Secrets Manager, IAM) |
| **Infrastructure as Code** | Terraform |
| **GitOps & CD** | ArgoCD, ArgoCD Image Updater |
| **CI/CD** | Jenkins |
| **Package Management** | Helm |
| **Monitoring** | Prometheus, Grafana |
| **Secret Management** | AWS Secrets Manager, CSI Driver |
| **Service Mesh** | NGINX Reverse Proxy |
| **Autoscaling** | HPA, Cluster Autoscaler |
| **Database** | MySQL (StatefulSet) |
| **Application** | Node.js (Backend), React (Frontend) |

---

## 📁 Project Structure

```
.
├── terraform/
│   ├── main.tf                          # Root Terraform configuration
│   ├── network/                         # VPC, Subnets, IGW, NAT Gateway
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── eks/                             # EKS Cluster, Node Groups, IAM
│       ├── main.tf
│       ├── cluster.tf
│       ├── node-groups.tf
│       ├── iam-roles.tf
│       ├── secrets-manager.tf
│       ├── argocd.tf
│       ├── variables.tf
│       └── data.tf
│
├── k8s/
│   ├── iti-gp-frontend-chart/           # Frontend Helm Chart
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       └── _helpers.tpl
│   │
│   ├── iti-gp-backend-chart/            # Backend Helm Chart
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── namespace.yaml
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── hpa.yaml
│   │       ├── network-policy.yaml
│   │       ├── secret-provider.yaml
│   │       ├── service-account.yaml
│   │       └── _helpers.tpl
│   │
│   └── iti-gp-db-chart/                 # Database Helm Chart
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── statefulset.yaml
│           ├── service.yaml
│           ├── pv.yaml
│           ├── pvc.yaml
│           ├── network-policy.yaml
│           ├── secret-provider.yaml
│           ├── service-account.yaml
│           └── _helpers.tpl
│
└── argocd/
    ├── app-of-apps.yaml              # App of Apps Pattern
    └── argocd-applications/
        ├── db-chart-app.yaml
        ├── back-chart-app.yaml
        ├── front-chart-app.yaml
        ├── jenkins-app.yaml
        ├── secrets-store-csi-app.yaml
        ├── secrets-provider-aws-app.yaml
        └── cluster-autoscaler-app.yaml
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **AWS CLI** (v2.x or later) - [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **kubectl** (v1.28 or later) - [Installation Guide](https://kubernetes.io/docs/tasks/tools/)
- **Terraform** (v1.5 or later) - [Installation Guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- **Helm** (v3.x or later) - [Installation Guide](https://helm.sh/docs/intro/install/)
- **AWS Account** with appropriate permissions
- **GitHub Token** (for ArgoCD Image Updater)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mohamedbstar413/iti-graduation-project.git
cd iti-graduation-project
```

### 2️⃣ Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
```

### 3️⃣ Initialize Terraform

```bash
cd terraform
terraform init
```

### 4️⃣ Deploy Infrastructure

```bash
# Review the planned changes
terraform plan

# Apply the configuration
terraform apply -var="git_token=YOUR_GITHUB_TOKEN"
```

This will provision:
- VPC with public/private subnets across 3 AZs
- EKS cluster with node groups
- IAM roles and policies (IRSA)
- AWS Secrets Manager secrets
- ArgoCD installation
- All necessary networking components

### 5️⃣ Configure kubectl

```bash
aws eks update-kubeconfig --name iti-gp-cluster --region us-east-1
```

### 6️⃣ Verify Cluster

```bash
kubectl get nodes
kubectl get namespaces
kubectl get pods -A
```

### 7️⃣ Access ArgoCD UI

```bash
# Get ArgoCD LoadBalancer URL
kubectl get svc -n argocd argocd-server

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### 8️⃣ Deploy Applications via ArgoCD

```bash
# Apply App of Apps pattern
kubectl apply -f argocd/applicationset.yaml

# Watch ArgoCD sync all applications
kubectl get applications -n argocd -w
```

---

## 🧩 Components

### Frontend (Namespace: `front-ns`)
- **Technology**: React + NGINX
- **Replicas**: 3 (configurable)
- **Service Type**: LoadBalancer (internet-facing)
- **Features**: 
  - NGINX reverse proxy with path-based routing
  - Health checks (readiness/liveness)
  - ConfigMap for NGINX configuration

### Backend (Namespace: `back-ns`)
- **Technology**: Node.js
- **Replicas**: 3 (auto-scaling 2-10)
- **Service Type**: ClusterIP
- **Features**:
  - HPA based on CPU utilization (70%)
  - AWS Secrets Manager integration
  - Network policies for security
  - Pod anti-affinity rules
  - Resource requests/limits

### Database (Namespace: `db-ns`)
- **Technology**: MySQL 8.0
- **Deployment**: StatefulSet
- **Storage**: Persistent Volume (1Gi)
- **Features**:
  - Init containers for secret mounting
  - Network policy (backend-only access)
  - Resource limits
  - TCP health checks

### ArgoCD (Namespace: `argocd`)
- **Components**: Server, Repo Server, Application Controller, Image Updater
- **Pattern**: App of Apps
- **Features**:
  - Automated sync and self-heal
  - ECR integration for image updates
  - Sync waves for orchestration
  - Git-based configuration

### Jenkins (Namespace: `jenkins`)
- **Storage**: Persistent Volume (1Gi)
- **Access**: LoadBalancer service
- **Features**:
  - Custom init container for permissions
  - Persistent home directory
  - Plugin pre-configuration

### Monitoring Stack (Namespace: `kube-system`)
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Features**:
  - Cluster-wide metrics
  - Application metrics
  - Custom dashboards
  - Alert rules

---

## 🔐 Security

### Secrets Management
```yaml
# AWS Secrets Manager stores credentials
# CSI Driver mounts secrets as Kubernetes secrets
# IRSA provides authentication without static credentials

Example Secret Structure:
{
  "username": "admin",
  "password": "encrypted_password"
}
```

### Network Policies
```yaml
# Backend can only be accessed by Frontend
# Database can only be accessed by Backend
# Explicit allow-list model
```

### IAM Roles (IRSA)
- `db_secret_role` - Access to Secrets Manager
- `autoscaler_role` - Cluster autoscaling permissions
- `ebs_csi_role` - EBS volume management
- `db_secret_role` - AWS secretsmanafer role

---

## 📊 Monitoring & Observability

### Prometheus Metrics
- Node metrics (CPU, memory, disk, network)
- Pod metrics (resource usage, restart counts)
- Kubernetes API metrics

### Grafana Dashboards
- **Cluster Overview**: Node health, resource utilization
- **Application Performance**: Request rates, latency, errors
- **Resource Usage**: CPU/Memory by namespace and pod

### Access Grafana
```bash
kubectl port-forward -n kube-system svc/grafana 3000:80
# Open http://localhost:3000
```

---

## 🔄 CI/CD Pipeline

### Workflow
```
Developer Push → GitHub → Jenkins Build → Docker Build → 
Push to ECR → ArgoCD Image Updater Detects → Auto Deploy → 
Health Checks → Production
```

### Jenkins Pipeline Stages
1. **Checkout** - Pull code from Git
2. **Build** - Compile application
3. **Test** - Run unit/integration tests
4. **Docker Build** - Create container image
5. **Push to Docker.io** - Upload to AWS registry
6. **Trigger ArgoCD** - Update image tag in Git
7. **Send Emain** - Send Email to notify a new build

### ArgoCD Sync Waves
```yaml
# Ensures proper deployment order
wave "0": Namespaces, PV, ConfigMaps
wave "1": PVC, ServiceAccounts, Secrets
wave "2": Deployments, StatefulSets
wave "3": Services
wave "4": HPA, NetworkPolicies
```

---

## ⚡ High Availability & Scaling

### Horizontal Pod Autoscaler (HPA)
```yaml
minReplicas: 2
maxReplicas: 10
targetCPUUtilization: 70%
```

### Cluster Autoscaler
- Automatically provisions new nodes when pods are pending
- Scales down underutilized nodes
- Respects pod disruption budgets

### Pod Anti-Affinity
```yaml
# Distributes pods across zones
topology.kubernetes.io/zone:
  - us-east-1a
  - us-east-1b
  - us-east-1c
```

### Load Balancing
- AWS Application Load Balancer for external traffic
- Kubernetes Services for internal traffic
- Session affinity support


---

## 👤 Author

**Mohamed Abdelsattar**
- GitHub: [@mohamedbstar413](https://github.com/mohamedbstar413)
- Email: mabdelsattar413@gmail.com


---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by Mohamed Abdelsattar

</div>
