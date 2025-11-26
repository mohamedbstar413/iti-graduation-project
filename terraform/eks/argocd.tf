#use alias provider to solve the failed to construct REST client issue
provider "kubernetes" {
  alias                  = "eks"
  host                   = aws_eks_cluster.iti_gp_cluster.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.iti_gp_cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.iti_gp_cluster.token
}

provider "helm" {
  alias = "eks"
  kubernetes {
    host                   = aws_eks_cluster.iti_gp_cluster.endpoint
    cluster_ca_certificate = base64decode(aws_eks_cluster.iti_gp_cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.iti_gp_cluster.token
  }
}



resource "kubernetes_namespace" "argocd" {
  provider = kubernetes.eks
  metadata {
    name = "argocd"
  }
  depends_on = [ aws_eks_cluster.iti_gp_cluster ]
}

resource "helm_release" "argocd" {
  provider = helm.eks
  name       = "argocd"
  chart      = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  namespace  = kubernetes_namespace.argocd.metadata[0].name
  version    = "7.5.2" # use latest stable version

  #Set service type of argocd-server
  set {
    name  = "server.service.type"
    value = "LoadBalancer"
  }

  depends_on = [
    aws_eks_cluster.iti_gp_cluster,
    kubernetes_namespace.argocd
  ]
}

