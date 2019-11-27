#!/usr/bin/env sh

set -x
set -e

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_DEV}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_DEV}
export BUCKET_NAME=fracas-client-pr-${TRAVIS_PULL_REQUEST}
export FRACAS_CLIENT_DOMAIN=http://example.com # Only needed to run "serverless info"

cd core && rm -rf node_modules && npm install --production && cd ..
cd serverless && bin/deploy-pull-request.sh && cd ..

cd serverless
npx serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpointWebsocket: | cut -d ' ' -f 2 > FRACAS_WEBSOCKET_ENDPOINT.txt
export FRACAS_WEBSOCKET_ENDPOINT=$(cat FRACAS_WEBSOCKET_ENDPOINT.txt)

npx serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpoint: | cut -d ' ' -f 2 > FRACAS_HTTP_ENDPOINT.txt
export FRACAS_HTTP_ENDPOINT=$(cat FRACAS_HTTP_ENDPOINT.txt)/graphql

npx serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^WebAppCloudFrontDistributionOutput: | cut -d ' ' -f 2 > CLOUDFRONT_DOMAIN.txt
export CLOUDFRONT_DOMAIN=$(cat CLOUDFRONT_DOMAIN.txt)

curl -H "Authorization: token ${GITHUB_TOKEN}" -X POST \
-d "{\"body\": \"Deployed ${TRAVIS_PULL_REQUEST_SHA}\nFrontend URL: https://${CLOUDFRONT_DOMAIN}\nAPI HTTP URL: ${FRACAS_HTTP_ENDPOINT}\nAPI Websocket URL: ${FRACAS_WEBSOCKET_ENDPOINT}\"}" \
"https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments"
cd ..