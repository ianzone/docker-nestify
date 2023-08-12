#!/usr/bin/env bash
set -Eeuo pipefail

docker run -d -p 3000:3000 --name nestify ianzone/nestify