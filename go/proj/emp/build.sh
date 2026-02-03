#!/usr/bin/env bash
set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <repository> <project>"
    echo "  repository: Docker repository name"
    echo "  project:    Project name"
    exit 1
fi

REPO=$1
PROJ=$2

docker build --no-cache --platform=linux/amd64 -t $REPO/$PROJ:latest .
docker push $REPO/$PROJ:latest
