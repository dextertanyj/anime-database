export const CONFIGURATION_KEYS = {
  INTEGRATION: {
    ANIDB: {
      CLIENT: {
        NAME: "ANIDB.CLIENT.NAME",
        VERSION: "ANIDB.CLIENT.VERSION",
      },
      TYPE: {
        TV_SERIES: "ANIDB.TYPE.TVSERIES",
        WEB: "ANIDB.TYPE.WEB",
        MOVIE: "ANIDB.TYPE.MOVIE",
        OVA: "ANIDB.TYPE.OVA",
        TV_SPECIAL: "ANIDB.TYPE.TVSPECIAL",
        MUSIC_VIDEO: "ANIDB.TYPE.MUSICVIDEO",
        OTHER: "ANIDB.TYPE.OTHER",
      },
    },
  },
} as const;

export const isConfigurationKey = (test: string): test is ConfigurationKeys => {
  return values(CONFIGURATION_KEYS).includes(test);
};

const isObject = (unknown: unknown): unknown is object => {
  return typeof unknown === "object" && unknown !== undefined && unknown !== null;
};

const values = (object: object): string[] =>
  Object.values(object).reduce<string[]>((previous, current) => {
    if (isObject(current)) {
      return previous.concat(values(current));
    } else if (typeof current === "string") {
      previous.push(current);
      return previous;
    }
    return previous;
  }, []);

type IsAny<T> = unknown extends T ? (keyof T extends never ? false : true) : false;

type Value<T> = T extends Record<string, unknown>
  ? keyof T extends string
    ? IsAny<T[keyof T]> extends true
      ? never
      : T[keyof T] extends string
      ? T[keyof T]
      : Value<T[keyof T]>
    : never
  : never;

export type ConfigurationKeys = Value<typeof CONFIGURATION_KEYS>;
