#!/usr/bin/env sh

cd core && bin/compile.sh && cd ..
cd serverless && bin/compile.sh && cd ..