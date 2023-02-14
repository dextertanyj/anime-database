import { Module } from "@nestjs/common";

import { EpisodeServiceModule } from "src/episode/episode.service.module";
import { FileSourceServiceModule } from "src/file-source/file-source.service.module";

import { FileResolver } from "./file.resolver";
import { FileServiceModule } from "./file.service.module";

@Module({
  imports: [FileServiceModule, EpisodeServiceModule, FileSourceServiceModule],
  providers: [FileResolver],
})
export class FileModule {}
