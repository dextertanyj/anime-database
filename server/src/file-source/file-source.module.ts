import { Module } from "@nestjs/common";

import { FileSourceResolver } from "./file-source.resolver";
import { FileSourceServiceModule } from "./file-source.service.module";

@Module({
	imports: [FileSourceServiceModule],
	providers: [FileSourceResolver],
})
export class FileSourceModule {}
