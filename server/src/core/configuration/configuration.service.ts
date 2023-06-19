import { Injectable } from "@nestjs/common";

import { Configuration } from "src/generated/graphql";

import { PrismaService } from "../prisma/prisma.service";

import { ConfigurationKeys } from "~shared/configuration-keys";

@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async get(key: ConfigurationKeys): Promise<Configuration> {
    const entry = await this.prisma.configuration.findUnique({
      where: { key },
    });
    return entry ?? { key };
  }

  async getAll(): Promise<Configuration[]> {
    const entries = await this.prisma.configuration.findMany();
    return entries;
  }

  async set(key: ConfigurationKeys, value: string): Promise<Configuration> {
    const entry = await this.prisma.configuration.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    return entry;
  }

  async unset(key: ConfigurationKeys): Promise<Configuration> {
    const entry = await this.prisma.configuration.delete({ where: { key } });
    return entry;
  }
}
