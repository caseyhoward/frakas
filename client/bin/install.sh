#!/usr/bin/env sh

set -x
set -e

npm install --global --unsafe-perm create-elm-app@4.0.0
npm install
curl -L -o elm.gz https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz
gunzip elm.gz
chmod +x elm
sudo mv elm /usr/local/bin/