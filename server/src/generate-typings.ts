import { join } from "path";

import { GraphQLDefinitionsFactory } from "@nestjs/graphql";

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: [join(__dirname, "..", "..", "schema.graphql")],
  path: join(process.cwd(), "src", "generated", "graphql.ts"),
  outputAs: "class",
  defaultScalarType: "unknown",
  customScalarTypeMapping: {
    DateTime: "Date",
    Long: "number",
  },
});
