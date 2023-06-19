import { join } from "path";

import { Injectable } from "@nestjs/common";
import convict, { Config, Path } from "convict";
import dotenv from "dotenv";

import { EnvironmentSchema, schema } from "./environment.schema";

dotenv.config({ path: join(__dirname, "..", "..", "..", "..", ".env") });

@Injectable()
export class EnvironmentService {
  config: Config<EnvironmentSchema>;
  constructor() {
    this.config = convict(schema);
    this.config.validate();
  }

  get<K extends Path<EnvironmentSchema>>(key: K) {
    return this.config.get(key);
  }
}
