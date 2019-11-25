#!/usr/bin/env sh

set -x
set -e

cd graphql && bin/generate-typescript.sh && cd -
cp graphql/build/Graphql.ts core/src/api/graphql.ts
printf "// GENERATED: DO NOT EDIT BY HAND\nexport const typeDefs = \`\n`cat graphql/src/schema.graphql`\n\`;" > serverless/src/Graphql.ts
