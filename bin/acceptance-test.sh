#!/usr/bin/env sh

set -e

npm install -g serverless@1.58.0

cd serverless
serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST}
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_DEV}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_DEV}
FRACAS_WEBSOCKET_ENDPOINT=`serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ServiceEndpointWebsocket | cut -d ' ' -f 2`
echo "FRACAS_WEBSOCKET_ENDPOINT=$FRACAS_WEBSOCKET_ENDPOINT"
cd ../acceptance-tests
FRACAS_WEBSOCKET_ENDPOINT=$FRACAS_WEBSOCKET_ENDPOINT bin/test.sh