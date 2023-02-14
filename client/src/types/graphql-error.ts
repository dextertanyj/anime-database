declare module "graphql" {
  interface GraphQLErrorExtensions {
    code?: string;
    response?: {
      statusCode?: number;
      message?: string;
      error?: string;
    };
  }
}

export default {};
