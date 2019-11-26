#!/usr/bin/env sh

set -x
set -e

ELM_APP_SUBSCRIPTION_URL=ws://localhost
ELM_APP_GRAPHQL_URL=http://localhost/graphql

npm install --global --unsafe-perm create-elm-app@4.0.0
curl -L -o elm.gz https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz
gunzip elm.gz
chmod +x elm
sudo mv elm /usr/local/bin/
elm-app build
