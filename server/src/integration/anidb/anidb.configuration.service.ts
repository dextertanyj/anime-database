import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/core/prisma/prisma.service";

const TYPES = ["TV Series", "TV Special", "OVA", "Movie", "Web", "Music Video", "Other"] as const;
type Type = (typeof TYPES)[number];

@Injectable()
export class AniDBConfigService {
  constructor(private prisma: PrismaService) {}

  async configureClient(data: { name: string; version: number }): Promise<void> {
    await this.prisma.configuration.upsert({
      where: { key: "anidb.client.name" },
      create: { key: "anidb.client.name", value: data.name },
      update: { value: data.name },
    });
    await this.prisma.configuration.upsert({
      where: { key: "anidb.client.version" },
      create: { key: "anidb.client.version", value: data.version.toString() },
      update: { value: data.version.toString() },
    });
  }

  async configureTypeMapping(data: Record<Type, string | null | undefined>): Promise<void> {
    for (const type in data) {
      const key = `anidb.types.${type.toLowerCase().replace(" ", "-")}`;
      const value = data[type as Type];
      if (value === undefined) {
        continue;
      }
      if (value === null) {
        await this.prisma.configuration.delete({
          where: { key },
        });
        continue;
      }
      await this.prisma.configuration.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }
  }
}
