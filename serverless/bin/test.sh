#!/usr/bin/env sh

set -e
set -x

tsc
npm run test
