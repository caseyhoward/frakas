#!/usr/bin/env sh

set -e
set -x

npm install -g serverless@1.58.0
export FRACAS_TABLE_NAME_SUFFIX=_PR_${TRAVIS_PULL_REQUEST}
export BUCKET_NAME=fracas-client-pr-${TRAVIS_PULL_REQUEST}
serverless deploy --stage pr-${TRAVIS_PULL_REQUEST}

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ServiceEndpointWebsocket | cut -d ' ' -f 2 > FRACAS_WEBSOCKET_ENDPOINT.txt
export ELM_APP_SUBSCRIPTION_URL=$(cat FRACAS_WEBSOCKET_ENDPOINT.txt)

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpoint: | cut -d ' ' -f 2 > FRACAS_HTTP_ENDPOINT.txt
export ELM_APP_GRAPHQL_URL=$(cat FRACAS_HTTP_ENDPOINT.txt)/graphql

cd ../client && elm-app build && cd ../serverless

curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

aws2 S3 sync ../client/build/ s3://${BUCKET_NAME}/