import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../schema.graphql",
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
        { add: { content: "/* eslint-disable */" } },
        { add: { content: "/* tslint:disable */" } },
        { add: { content: 'import type { ClientError } from "graphql-request"' } },
      ],
      config: {
        strictScalars: true,
        defaultScalarType: "unknown",
        scalars: {
          DateTime: "Date",
          Long: "number",
        },
        fetcher: "graphql-request",
        errorType: "ClientError",
        exposeQueryKeys: true,
        exposeDocument: true,
      },
    },
  },
};

export default config;
