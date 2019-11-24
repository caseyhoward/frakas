#!/usr/bin/env sh

set -e
set -x

# npm install -g serverless@1.58.0

cd serverless
FRACAS_WEBSOCKET_ENDPOINT=`serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ServiceEndpointWebsocket | cut -d ' ' -f 2`
cd ../acceptance-tests
FRACAS_WEBSOCKET_ENDPOINT=$FRACAS_WEBSOCKET_ENDPOINT bin/test.sh