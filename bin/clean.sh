#!/usr/bin/env sh

set -x
set -e

cd core && bin/clean.sh && cd ..
cd client && bin/clean.sh && cd ..
cd serverless && bin/clean.sh && cd ..