#!/usr/bin/env sh

set -e
set -x

npm install -g serverless@1.58.0
export FRACAS_TABLE_NAME_SUFFIX=_PR_${TRAVIS_PULL_REQUEST}
serverless deploy --stage pr-${TRAVIS_PULL_REQUEST}
