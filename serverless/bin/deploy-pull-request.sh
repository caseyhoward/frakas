#!/usr/bin/env sh

set -e
set -x

npm install -g serverless@1.58.0
export FRACAS_TABLE_NAME_SUFFIX=_PR_${TRAVIS_PULL_REQUEST}
serverless deploy --stage pr-${TRAVIS_PULL_REQUEST}

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ServiceEndpointWebsocket | cut -d ' ' -f 2 > FRACAS_WEBSOCKET_ENDPOINT.txt
export ELM_APP_SUBSCRIPTION_URL=$(cat FRACAS_WEBSOCKET_ENDPOINT.txt)

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpoint: | cut -d ' ' -f 2 > FRACAS_HTTP_ENDPOINT.txt
export ELM_APP_GRAPHQL_URL=$(cat FRACAS_HTTP_ENDPOINT.txt)/graphql

cd ../client && elm-app build && cd ../serverless

serverless client deploy --no-confirm