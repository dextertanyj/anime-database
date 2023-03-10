import { Season } from "src/generated/graphql";

export const seasonToDisplayString = (season: Season) => {
  switch (season) {
    case Season.Fall:
      return "Fall";
    case Season.Spring:
      return "Spring";
    case Season.Summer:
      return "Summer";
    case Season.Winter:
      return "Winter";
  }
};
