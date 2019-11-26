#!/usr/bin/env sh

set -x
set -e

npm install -g typescript@3.7.2
npm install -g serverless@1.58.0
cd core && bin/install.sh && cd ..
cd serverless && bin/install.sh && cd ..
cd client && bin/install.sh && cd ..
cd acceptance-tests && bin/install.sh && cd ..