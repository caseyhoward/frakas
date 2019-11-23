#!/usr/bin/env sh

set -x
set -e

echo "Compile core"
cd core && bin/compile.sh && cd ..

echo "Compile serverless"
cd serverless && bin/compile.sh && cd ..

ls -alh core/src/