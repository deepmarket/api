# Kubernetes Deployment for the Deepmarket API

### Setup

How to get a deployment of the DeepMarket/api repo running locally in kubernetes with minikube.  This is intended to provide resiliency to the pacific and atlantic servers.

Steps to get this to work are outlined below.

Before doing anything else:
- Make sure to have `minikube` running locally.  Can check this with `minikube ip` and make sure that it spits something out.
- [minikube installation instructions](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- Enable the ingress functionality in minikube:
    - `$ minikube addons enable ingress`

To set up:

- clone this repo and cd into the root dir
- Deploy mongo
    - `$ kubectl apply -f ./mongo/headless_service.yaml`
    - `$ kubectl apply -f ./mongo/stateful_sets.yaml`
- Configure mongo
    - Wait until mongo pods are ready.  check their status with `$ kubectl get pods`
    - When they are ready, initialize the replica set:
    - *I Should Write A Script For This*
    - exec into a running shell in the first pod: `$ kubectl exec -it dm-mongo-0 -- /bin/sh`
    - run mongo: `#/ mongo`
    - run the replica set initiate command:
    ```bash
    $ rs.initiate({_id: "DmRS", version: 1, members: [
        { _id: 0, host : "dm-mongo-0.dm-mongo-svc.default.svc.cluster.local:27017" },
        { _id: 1, host : "dm-mongo-1.dm-mongo-svc.default.svc.cluster.local:27017" },
        { _id: 2, host : "dm-mongo-2.dm-mongo-svc.default.svc.cluster.local:27017" },
    ]});
    ```
- Deploy api service:
    - `$ kubectl apply -f api_service.yaml`
- Deploy api:
    - `$ kubectl apply -f api_deployment.yaml`
- Deploy the Ingress controller:
    - `$ kubectl apply -f ingress.yaml`

### Testing

Find your minikube ip address:

```bash
$ minikube ip
172.17.136.94
```

From there, visit the api in your web browser to make sure api is online:

`http://172.17.136.94:80`

Should return the "api is online" message.

### Testing with PLUTO

In PLUTO, [point the api to your minikube ip address on port 80](https://github.com/deepmarket/PLUTO/blob/develop/src/main/python/api.py#L44) and test that functionality behaves as normal.
