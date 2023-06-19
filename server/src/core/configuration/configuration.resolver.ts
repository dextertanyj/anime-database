import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AdminGuard } from "src/authentication/admin.guard";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { SetConfigurationInput } from "src/generated/graphql";

import { ConfigurationService } from "./configuration.service";

import { isConfigurationKey } from "~shared/configuration-keys";

@Resolver()
export class ConfigurationResolver {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Query()
  @UseGuards(AdminGuard)
  async configuration(@Args("key") key: string) {
    if (!isConfigurationKey(key)) {
      throw new EntityNotFoundError(`Configuration key does not exist. (Key: ${key})`);
    }
    return this.configurationService.get(key);
  }

  @Query()
  @UseGuards(AdminGuard)
  async configurations() {
    return this.configurationService.getAll();
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async setConfiguration(@Args("input") input: SetConfigurationInput) {
    if (!isConfigurationKey(input.key)) {
      throw new EntityNotFoundError(`Configuration key does not exist. (Key: ${input.key})`);
    }
    if (!input.value) {
      return this.configurationService.unset(input.key);
    }
    return this.configurationService.set(input.key, input.value);
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async setConfigurations(@Args("input") input: SetConfigurationInput[]) {
    return input.map((entry) => {
      if (!isConfigurationKey(entry.key)) {
        throw new EntityNotFoundError(`Configuration key does not exist. (Key: ${entry.key})`);
      }
      if (!entry.value) {
        return this.configurationService.unset(entry.key);
      }
      return this.configurationService.set(entry.key, entry.value);
    });
  }
}
