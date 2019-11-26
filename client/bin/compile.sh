#!/usr/bin/env sh

set -x
set -e

ELM_APP_SUBSCRIPTION_URL=ws://localhost
ELM_APP_GRAPHQL_URL=http://localhost/graphql

elm-app build
