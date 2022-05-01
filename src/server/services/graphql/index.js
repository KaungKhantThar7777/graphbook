import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";

import authDirective from "./auth";
import Resolvers from "./resolvers";
import Schema from "./schema";
import JWT from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export default (utils) => {
  const { authDirectiveTypeDefs, authDirectiveTransformer } =
    authDirective("auth");

  let executableSchema = makeExecutableSchema({
    typeDefs: [authDirectiveTypeDefs, Schema],
    resolvers: Resolvers.call(utils),
  });

  executableSchema = authDirectiveTransformer(executableSchema);
  const server = new ApolloServer({
    schema: executableSchema,
    context: ({ req }) => {
      const authorization = req.headers.authorization;

      if (authorization !== undefined) {
        const search = "Bearer";
        const regEx = new RegExp(search, "ig");
        const token = authorization.replace(regEx, "").trim();

        return JWT.verify(token, JWT_SECRET, (err, result) => {
          if (err) {
            console.log(err);
            return req;
          } else {
            return utils.db.models.User.findByPk(result.id).then((user) => {
              return Object.assign({}, req, { user });
            });
          }
        });
      } else {
        return req;
      }
    },
  });

  return server;
};
