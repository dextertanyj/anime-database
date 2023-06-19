import { addFormats, Schema } from "convict";

export interface EnvironmentSchema {
  port: number;
  environment: "development" | "staging" | "production" | "test";
  database: {
    username: string;
    password: string;
    host: string;
    port: number;
    database: string;
  };
  redis: {
    host: string;
    port: number;
  };
  session: {
    name: string;
    secret: string;
    maxAge: number;
  };
}

addFormats({
  "required-string": {
    validate: (value?: string): void => {
      if (value == undefined || value === "") {
        throw new Error("Required value cannot be empty.");
      }
    },
  },
});

export const schema: Schema<EnvironmentSchema> = {
  port: {
    env: "PORT",
    format: "port",
    default: 8080,
  },
  environment: {
    env: "NODE_ENV",
    format: ["development", "staging", "production", "test"],
    default: "development",
  },
  database: {
    username: {
      env: "DATABASE_USERNAME",
      format: "required-string",
      default: "",
    },
    password: {
      env: "DATABASE_PASSWORD",
      format: "required-string",
      default: "",
    },
    host: {
      env: "DATABASE_HOST",
      format: "required-string",
      default: "",
    },
    port: {
      env: "DATABASE_PORT",
      format: "port",
      default: 5432,
    },
    database: {
      env: "DATABASE_NAME",
      format: "required-string",
      default: "",
    },
  },
  redis: {
    host: {
      env: "REDIS_HOST",
      format: "required-string",
      default: "",
    },
    port: {
      env: "REDIS_PORT",
      format: "port",
      default: 6379,
    },
  },
  session: {
    name: {
      env: "SESSION_NAME",
      format: "required-string",
      default: "anime.database.sid",
    },
    secret: {
      env: "SESSION_SECRET",
      sensitive: true,
      format: "required-string",
      default: "",
    },
    maxAge: {
      env: "SESSION_MAX_AGE",
      format: Number,
      default: 604800000,
    },
  },
};
