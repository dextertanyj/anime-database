import { GraphQLDefinitionsFactory } from "@nestjs/graphql";
import { join } from "path";

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
