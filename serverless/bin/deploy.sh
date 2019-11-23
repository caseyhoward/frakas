#!/usr/bin/env sh

tsc
npm install -g serverless@1.58.0

export FRACAS_TABLE_NAME_SUFFIX=""
serverless deploy