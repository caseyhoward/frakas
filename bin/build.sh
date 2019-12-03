#!/usr/bin/env sh

set -x
set -e

# ./bin/clean.sh # Trying caching to see if it speeds up build
./bin/compile.sh
./bin/test.sh
