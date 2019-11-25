#!/usr/bin/env sh

generate_elm()
{
  rm -rf src/Api
  npx elm-graphql --introspection-file graphql.schema.json --base Api
}

bin/generate-typescript.sh && generate_elm