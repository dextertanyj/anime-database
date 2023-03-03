import { Injectable } from "@nestjs/common";
import { Reference } from "@prisma/client";

import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySeries(seriesId: string): Promise<Reference[]> {
    return this.prisma.reference.findMany({
      where: { seriesId },
    });
  }

  async getSources(): Promise<string[]> {
    const sources = await this.prisma.reference.findMany({
      select: { source: true },
      distinct: ["source"],
    });
    return sources.map((value) => value.source);
  }
}
