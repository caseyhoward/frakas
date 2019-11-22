#!/usr/bin/env sh

tsc
npm install -g serverless@1.58.0
serverless deploy --stage production