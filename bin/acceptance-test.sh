#!/usr/bin/env sh

set -x
set -e

npm install -g serverless@1.58.0

./bin/compile.sh
cd serverless
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_DEV}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_DEV}
export BUCKET_NAME=fracas-client-pr-${TRAVIS_PULL_REQUEST}
export FRACAS_CLIENT_DOMAIN=http://example.com # Only needed to run "serverless info"

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ServiceEndpointWebsocket | cut -d ' ' -f 2 > FRACAS_WEBSOCKET_ENDPOINT.txt
export FRACAS_WEBSOCKET_ENDPOINT=$(cat FRACAS_WEBSOCKET_ENDPOINT.txt)

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpoint: | cut -d ' ' -f 2 > FRACAS_HTTP_ENDPOINT.txt
export FRACAS_HTTP_ENDPOINT=$(cat FRACAS_HTTP_ENDPOINT.txt)/graphql

cd ../acceptance-tests
FRACAS_WEBSOCKET_ENDPOINT=$FRACAS_WEBSOCKET_ENDPOINT bin/test.sh