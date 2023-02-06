import { Module } from "@nestjs/common";

import { FileResolver } from "./file.resolver";
import { FileServiceModule } from "./file.service.module";

@Module({
	imports: [FileServiceModule],
	providers: [FileResolver],
})
export class FileModule {}
