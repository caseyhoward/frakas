import { makeExecutableSchema, IResolvers } from "graphql-tools";
import * as PubSub from "fracas-shared/src/PubSub";
import * as Graphql from "../Graphql";
import * as graphql from "graphql";
import * as Resolvers from "fracas-shared/src/Resolvers";
import * as Repository from "fracas-shared/src/Repository";

export function create(
  repository: Repository.Repository,
  pubSub: PubSub.PubSub
): graphql.GraphQLSchema {
  const resolvers: IResolvers<any, any> = <any>(
    Resolvers.create(repository, pubSub)
  );
  return makeExecutableSchema({
    typeDefs: Graphql.typeDefs,
    resolvers: resolvers
  });
}

export function createWithoutSubscriptions(
  repository: Repository.Repository,
  pubSub: PubSub.PubSub
): graphql.GraphQLSchema {
  const resolvers: IResolvers<any, any> = <any>(
    Resolvers.createWithoutSubscriptions(repository, pubSub)
  );
  return makeExecutableSchema({
    typeDefs: Graphql.typeDefs,
    resolvers: resolvers
  });
}
