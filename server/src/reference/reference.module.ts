import { Module } from "@nestjs/common";

import { ReferenceServiceModule } from "src/reference/reference.service.module";

import { ReferenceResolver } from "./reference.resolver";

@Module({
  imports: [ReferenceServiceModule],
  providers: [ReferenceResolver],
})
export class ReferenceModule {}
