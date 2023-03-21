import { CustomScalar, Scalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

@Scalar("Long", () => Number)
export class LongScalar implements CustomScalar<number, number> {
  isNumber(value: unknown) {
    try {
      if (Number.isSafeInteger(Number(value))) {
        return Number(value);
      } else {
        throw new Error(`Invalid value.`);
      }
    } catch {
      throw new Error(`Invalid value.`);
    }
  }

  parseValue(value: unknown): number {
    return this.isNumber(value);
  }

  serialize(value: unknown): number {
    return this.isNumber(value);
  }

  parseLiteral(ast: ValueNode): number {
    if (ast.kind === Kind.INT) {
      return Number(ast.value);
    }
    throw new Error(`Invalid value.`);
  }
}
