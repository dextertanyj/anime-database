import { Module } from "@nestjs/common";

import { FileServiceModule } from "src/file/file.service.module";

import { FileSourceResolver } from "./file-source.resolver";
import { FileSourceServiceModule } from "./file-source.service.module";

@Module({
	imports: [FileSourceServiceModule, FileServiceModule],
	providers: [FileSourceResolver],
})
export class FileSourceModule {}
