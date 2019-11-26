#!/usr/bin/env sh

set -e
set -x

FRACAS_TABLE_NAME_SUFFIX=Test serverless dynamodb start & sleep 5 && npm run test