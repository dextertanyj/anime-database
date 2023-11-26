import {
  Integration,
  useIntegrationsQuery,
  useSearchIntegrationQuery,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";

const useIntegrations = () => {
  return useIntegrationsQuery(client);
};

const useSearchIntegration = ({ integration, id }: { integration: Integration; id: string }) => {
  return useSearchIntegrationQuery(client, { integration, id });
};

export const integration = {
  useGet: useIntegrations,
  useSearch: useSearchIntegration,
} as const;
