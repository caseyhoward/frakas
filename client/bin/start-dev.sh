#!/usr/bin/env sh

set -e

export ELM_APP_GRAPHQL_URL=http://192.168.1.7:4000
export ELM_APP_SUBSCRIPTION_URL=ws://192.168.1.7:4000
elm-app start