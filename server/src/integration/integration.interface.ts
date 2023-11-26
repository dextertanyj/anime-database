import { IntegrationSeries, SeriesType } from "src/generated/graphql";

type NormalizedIntegrationSeries = Omit<
  IntegrationSeries,
  "type" | "prequels" | "sequels" | "mainStories" | "sideStories" | "relatedSeries"
> & { type: Omit<SeriesType, "series"> | null | undefined } & Record<
    "prequels" | "sequels" | "mainStories" | "sideStories" | "relatedSeries",
    { id: string; title: string }[]
  >;

export interface IIntegration {
  isConfigured(): Promise<boolean>;
  search(id: string): Promise<NormalizedIntegrationSeries | null>;
}
