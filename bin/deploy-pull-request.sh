#!/usr/bin/env sh

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID_DEV}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY_DEV}

cd serverless && bin/deploy-pull-request.sh && cd ..

cd serverless
serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpointWebsocket: | cut -d ' ' -f 2 > FRACAS_WEBSOCKET_ENDPOINT.txt
export FRACAS_WEBSOCKET_ENDPOINT=$(cat FRACAS_WEBSOCKET_ENDPOINT.txt)

serverless info --verbose --stage pr-${TRAVIS_PULL_REQUEST} | grep ^ServiceEndpoint: | cut -d ' ' -f 2 > FRACAS_HTTP_ENDPOINT.txt
export FRACAS_HTTP_ENDPOINT=$(cat FRACAS_HTTP_ENDPOINT.txt)/graphql

curl -H "Authorization: token ${GITHUB_TOKEN}" -X POST \
-d "{\"body\": \"Deployed ${TRAVIS_PULL_REQUEST_SHA}\nHttp endpoint: ${FRACAS_HTTP_ENDPOINT}\nWebsocket endpoint: ${FRACAS_WEBSOCKET_ENDPOINT}\"}" \
"https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments"
cd ..