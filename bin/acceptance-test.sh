#!/usr/bin/env sh

set -e

npm install -g serverless@1.58.0

cd serverless
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_DEV}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_DEV}
serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST}
serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ServiceEndpointWebsocket | cut -d ' ' -f 2 > FRACAS_WEBSOCKET_ENDPOINT.txt
export FRACAS_WEBSOCKET_ENDPOINT=$(cat FRACAS_WEBSOCKET_ENDPOINT.txt)
echo "FRACAS_WEBSOCKET_ENDPOINT=$FRACAS_WEBSOCKET_ENDPOINT"
cd ../acceptance-tests
FRACAS_WEBSOCKET_ENDPOINT=$FRACAS_WEBSOCKET_ENDPOINT bin/test.sh
rm FRACAS_WEBSOCKET_ENDPOINT.txt