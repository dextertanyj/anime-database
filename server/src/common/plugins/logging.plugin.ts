import { Plugin } from "@nestjs/apollo";
import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";
import { FieldNode, Kind } from "graphql";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

const format = ({
  operation = "UNKNOWN",
  name = "",
  selections = [],
  errors,
}: {
  operation?: string;
  name?: string;
  selections?: string[];
  errors?: { name: string; message: string }[];
}): string => {
  operation = operation.toUpperCase();
  const base = `${operation} (${name}) [${selections.join("|")}]`;
  if (!errors) {
    return `${base} OK`;
  }
  const formattedErrors = errors.map(
    (error) => `(${error.name}) ${error.message.replace("\n", " | ")}`,
  );
  return base + ": " + formattedErrors.join(" || ");
};

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  constructor(
    @InjectPinoLogger("API")
    private readonly logger: PinoLogger,
  ) {}

  async requestDidStart(): Promise<void | GraphQLRequestListener> {
    const info = (obj: unknown, msg?: string | undefined, ...args: unknown[]) => {
      this.logger.info(obj, msg, ...args);
    };
    info.bind(this);

    return {
      async willSendResponse(context: GraphQLRequestContext): Promise<void> {
        const operation: string | undefined = context.operation?.operation;
        const name: string | undefined = context.operationName ?? undefined;
        const selections: string[] | undefined = context.operation?.selectionSet?.selections
          .filter((selection): selection is FieldNode => selection.kind === Kind.FIELD)
          .map((selection) => selection.name.value);
        const errors: { name: string; message: string }[] | undefined = context.errors?.map(
          (error) => error.originalError ?? error,
        );
        const message = format({ operation, name, selections, errors });
        info(message);
      },
    };
  }
}
