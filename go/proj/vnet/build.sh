#!/usr/bin/env bash
set -e
REPO=$1
PROJ=$2
docker build --no-cache --platform=linux/amd64 -t $REPO/$PROJ-vnet:latest .
docker push $REPO/$PROJ-vnet:latest
