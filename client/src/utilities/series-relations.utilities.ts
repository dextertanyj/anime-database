export const RELATIONSHIPS = [
  "prequels",
  "sequels",
  "mainStories",
  "sideStories",
  "relatedSeries",
] as const;

export type RelationshipTypes = (typeof RELATIONSHIPS)[number];

export const renderSeriesRelations = (relationship: RelationshipTypes) => {
  switch (relationship) {
    case "prequels":
      return "Prequels";
    case "sequels":
      return "Sequels";
    case "mainStories":
      return "Main Stories";
    case "sideStories":
      return "Side Stories";
    case "relatedSeries":
      return "Others";
  }
};
