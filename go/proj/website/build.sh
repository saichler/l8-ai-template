#!/usr/bin/env bash
set -e
docker build --no-cache --platform=linux/amd64 -t saichler/erp-web:latest .
docker push saichler/erp-web:latest
