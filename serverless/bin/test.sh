#!/usr/bin/env sh

set -e
set -x

export FRACAS_TABLE_NAME_SUFFIX=Test
export BUCKET_NAME=blah
export FRACAS_CLIENT_DOMAIN=blah
# docker-compose up -d dynamodb
# serverless dynamodb migrate --stage test

tsc
npm run test
