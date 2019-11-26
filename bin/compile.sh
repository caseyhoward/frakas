#!/usr/bin/env sh

set -x
set -e

cd core && bin/compile.sh && cd ..
cd serverless && bin/compile.sh && cd ..
cd client && bin/compile.sh && cd ..