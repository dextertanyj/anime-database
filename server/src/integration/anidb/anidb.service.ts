import { Injectable } from "@nestjs/common";
import axios from "axios";
import { getMonth } from "date-fns";
import { RateLimiter } from "limiter";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { reshaperBuilder, Schema } from "object-reshaper";
import { parseStringPromise } from "xml2js";
import { z } from "zod";

import { ConfigurationService } from "src/core/configuration/configuration.service";
import { RedisService } from "src/core/redis/redis.service";
import { Season } from "src/generated/graphql";
import { SeriesService } from "src/series/series.service";
import { SeriesTypeService } from "src/series-type/series-type.service";

import { IIntegration } from "../integration.interface";

import { CONFIGURATION_KEYS } from "~shared/configuration-keys";

const KEYS = CONFIGURATION_KEYS.INTEGRATION.ANIDB;

const titleSchema = z.object({
  _: z.string(),
  $: z.object({ "xml:lang": z.string(), type: z.string() }),
});

// TODO: Refine schema.
const schema = z.object({
  anime: z
    .object({
      $: z.object({ id: z.string(), restricted: z.string() }).required(),
      type: z.array(z.string()),
      startdate: z.array(z.string()),
      titles: z.array(
        z.object({
          title: z.array(titleSchema),
        }),
      ),
      relatedanime: z.array(
        z.object({
          anime: z.array(
            z.object({
              _: z.string(),
              $: z.object({ id: z.string(), type: z.string() }),
            }),
          ),
        }),
      ),
      episodes: z.array(
        z.object({
          episode: z.array(
            z.object({
              $: z.object({ id: z.string(), update: z.string() }),
              epno: z.array(z.object({ _: z.string(), $: z.object({ type: z.string() }) })),
              title: z.array(titleSchema),
            }),
          ),
        }),
      ),
    })
    .deepPartial(),
});

type Result = z.infer<typeof schema>;

const reshapedSchema = {
  id: "anime.$.id",
  type: "anime.type[0]",
  titles: ["anime.titles[*].title[*]", { title: "_", language: "$.xml:lang", type: "$.type" }],
  releaseDate: "anime.startdate[0]",
  relatedAnime: ["anime.relatedanime[*].anime[*]", { title: "_", relation: "$.type" }],
  episodes: [
    "anime.episodes[*].episode[*]",
    {
      titles: ["title[*]", { title: "_", language: "$.type" }],
      episodeNumber: "epno[0]._",
      type: "epno[0].$.type",
    },
  ],
} as const satisfies Schema<Result>;
const reshaper = reshaperBuilder<Result, typeof reshapedSchema>(reshapedSchema);
type Data = ReturnType<typeof reshaper>;

@Injectable()
export class AniDBService implements IIntegration {
  private NAMESPACE = "ANIDB";
  private limiter: RateLimiter;

  constructor(
    @InjectPinoLogger("AniDBService") private readonly logger: PinoLogger,
    private readonly redis: RedisService,
    private readonly configuration: ConfigurationService,
    private readonly seriesService: SeriesService,
    private readonly typeService: SeriesTypeService,
  ) {
    this.limiter = new RateLimiter({ tokensPerInterval: 1, interval: 2.5 * 60 * 1000 });
  }

  async isConfigured() {
    return !!(
      (await this.configuration.get(KEYS.CLIENT.NAME)) &&
      (await this.configuration.get(KEYS.CLIENT.VERSION))
    );
  }

  async search(id: string) {
    const cached = await this.redis.get(this.NAMESPACE, id);
    if (cached) {
      this.logger.info(`Cache hit (Integration: AniDB, ID: ${id})`);
      return this.process(JSON.parse(cached) as object);
    }
    const allowed = this.limiter.tryRemoveTokens(1);
    if (!allowed) {
      this.logger.info(`Rate limited (Integration: AniDB)`);
      throw new Error("Rate limited");
    }
    const response = await axios.get<string>("http://api.anidb.net:9001/httpapi", {
      params: {
        request: "anime",
        aid: id,
        client: await this.configuration.get(KEYS.CLIENT.NAME),
        clientver: await this.configuration.get(KEYS.CLIENT.VERSION),
        protover: 1,
      },
    });
    const data = (await parseStringPromise(response.data)) as object;
    await this.redis.set(this.NAMESPACE, id, JSON.stringify(data));
    return this.process(data);
  }

  private async process(response: object) {
    try {
      const parsed = schema.parse(response);
      const data = reshaper(parsed);
      const { title, alternativeTitles } = this.extractTitles(data);
      const { type } = await this.extractSeriesType(data);
      const { releaseYear, releaseSeason } = this.extractReleaseDate(data);
      const { episodes } = this.extractEpisodes(data);
      const relations = await this.extractRelations(data);
      const references = [{ link: `https://anidb.net/anime/${data.id || ""}`, source: "AniDB" }];
      return {
        title,
        alternativeTitles,
        type,
        releaseSeason,
        releaseYear,
        ...relations,
        references,
        episodes,
      };
    } catch (e) {
      this.logger.warn(e);
      return null;
    }
  }

  private extractTitles(data: Data): { title: string; alternativeTitles: string[] } {
    const mainTitle = data.titles?.filter((title) => title.type === "main")?.[0].title ?? "";
    const alternativeTitles = (data.titles ?? [])
      .filter((title) => title.title !== mainTitle)
      .filter((title) => title.language === "en" || title.language === "ja")
      .map((title) => title.title)
      .filter((title): title is string => !!title);
    return { title: mainTitle, alternativeTitles };
  }

  private extractReleaseDate(data: Data): {
    releaseYear: number | null;
    releaseSeason: Season | null;
  } {
    if (!data.releaseDate) {
      return { releaseYear: null, releaseSeason: null };
    }
    const date = new Date(data.releaseDate);
    const releaseYear = date.getFullYear() ?? null;
    const releaseMonth = getMonth(date);
    const releaseSeason =
      releaseMonth < 3 || releaseMonth === 11
        ? Season.WINTER
        : releaseMonth < 5
        ? Season.SPRING
        : releaseMonth < 8
        ? Season.SUMMER
        : Season.FALL;
    return { releaseYear, releaseSeason };
  }

  private async extractSeriesType(data: Data) {
    const type = data.type;
    let seriesTypeId = "";
    switch (type) {
      case "TV Special":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.TV_SERIES)).value || "";
        break;
      case "OVA":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.OVA)).value || "";
        break;
      case "Web":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.WEB)).value || "";
        break;
      case "Movie":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.MOVIE)).value || "";
        break;
      case "Music Video":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.MUSIC_VIDEO)).value || "";
        break;
      case "TV Series":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.TV_SERIES)).value || "";
        break;
      case "Other":
        seriesTypeId = (await this.configuration.get(KEYS.TYPE.OTHER)).value || "";
        break;
    }
    return { type: await this.typeService.getById(seriesTypeId) };
  }

  private async extractRelations(data: Data) {
    if (!data.relatedAnime) {
      return { prequels: [], sequels: [], mainStories: [], sideStories: [], relatedSeries: [] };
    }
    const relatedAnime = data.relatedAnime.filter(
      (anime): anime is { title: string; relation: string } => !!anime.title && !!anime.relation,
    );

    const flatten = async (array: { title: string; relation: string }[]) =>
      (
        await Promise.all(
          array.map(async (anime) => await this.seriesService.getByTitle(anime.title)),
        )
      ).flat();

    const prequels = await flatten(relatedAnime.filter((anime) => anime.relation === "Prequel"));
    const sequels = await flatten(relatedAnime.filter((anime) => anime.relation === "Sequel"));
    const sideStories = await flatten(
      relatedAnime.filter((anime) => anime.relation === "Side Story"),
    );
    const mainStories = await flatten(
      relatedAnime.filter((anime) => anime.relation === "Parent Story"),
    );
    const relatedSeries = await flatten(
      relatedAnime.filter((anime) =>
        ["Prequel", "Sequel", "Side Story", "Parent Story"].includes(anime.relation),
      ),
    );
    return { prequels, sequels, mainStories, sideStories, relatedSeries };
  }

  private extractEpisodes(data: Data) {
    if (!data.episodes) {
      return { episodes: [] };
    }
    const episodes = data.episodes
      .filter((episode) => episode.type === "1")
      .map((episode) => ({
        title: episode.titles?.filter((title) => title.language === "x-jat")?.[0].title ?? "",
        alternativeTitles: [],
        episodeNumber: Number(episode.episodeNumber),
      }));
    return { episodes };
  }
}
