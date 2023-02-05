import { Injectable } from "@nestjs/common";
import { Prisma, Reference, Season, Series } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import assert from "assert";
import deepEqual from "deep-equal";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { setCompare } from "src/common/utilities/sets.utilities";
import { releaseDateComparator } from "src/common/utilities/time.utilties";
import { PrismaService } from "src/core/prisma/prisma.service";

const SIMPLE_RELATIONS = [
	"prequels",
	"sequels",
	"mainStories",
	"sideStories",
] as const;

const RELATIONS = [
	...SIMPLE_RELATIONS,
	"relatedSeries",
	"relatedAlternatives",
] as const;

type Relations = (typeof RELATIONS)[number];

@Injectable()
export class SeriesService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(): Promise<Series[]> {
		return this.prisma.series.findMany();
	}

	async getById(id: string): Promise<Series | null> {
		return this.prisma.series.findUnique({
			where: { id },
		});
	}

	async getByTitle(title: string): Promise<Series[]> {
		return this.prisma.series.findMany({
			where: { title: { contains: title } },
		});
	}

	async getByEpisode(episodeId: string): Promise<Series> {
		const serieses = await this.prisma.series.findMany({
			where: { episodes: { some: { id: episodeId } } },
		});
		return serieses[0];
	}

	async getByRelation(
		type: Exclude<Relations, "relatedAlternatives">,
		seriesId: string,
	): Promise<Series[]> {
		let where: Prisma.SeriesWhereInput = { [type]: { some: { id: seriesId } } };
		if (type === "relatedSeries") {
			where = {
				OR: [
					{ [type]: { some: { id: seriesId } } },
					{ relatedAlternatives: { some: { id: seriesId } } },
				],
			};
		}
		return this.prisma.series.findMany({ where });
	}

	async create(data: {
		title: string;
		alternativeTitles: string[];
		seriesTypeId: string;
		releaseYear?: number;
		releaseSeason?: Season;
		remarks?: string | null;
		prequels: string[];
		sequels: string[];
		mainStories: string[];
		sideStories: string[];
		relatedSeries: string[];
		references: { source: string; link: string }[];
	}): Promise<Series | null> {
		const {
			prequels,
			sequels,
			mainStories,
			sideStories,
			relatedSeries,
			references,
			...rest
		} = data;
		try {
			return await this.prisma.series.create({
				data: {
					...rest,
					prequels: { connect: prequels.map((id) => ({ id })) },
					sequels: { connect: sequels.map((id) => ({ id })) },
					mainStories: { connect: mainStories.map((id) => ({ id })) },
					sideStories: { connect: sideStories.map((id) => ({ id })) },
					relatedSeries: { connect: relatedSeries.map((id) => ({ id })) },
					references: {
						createMany: { data: references, skipDuplicates: true },
					},
				},
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.FOREIGN_KEY_ERROR) {
				throw new EntityNotFoundError(
					`SeriesType does not exist. (Type ID: ${data.seriesTypeId})`,
				);
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError(`Related series not found.`);
			}
			return null;
		}
	}

	async update(
		id: string,
		data: {
			title?: string;
			alternativeTitles?: string[];
			seriesTypeId?: string;
			releaseYear?: number | null;
			releaseSeason?: Season | null;
			remarks?: string | null;
			prequels?: string[];
			sequels?: string[];
			mainStories?: string[];
			sideStories?: string[];
			relatedSeries?: string[];
			references?: { id?: string; source: string; link: string }[];
		},
	): Promise<Series | null> {
		const {
			prequels,
			sequels,
			mainStories,
			sideStories,
			relatedSeries,
			...rest
		} = data;
		const series = await this.prisma.series.findUnique({
			where: { id },
			include: {
				prequels: { select: { id: true } },
				sequels: { select: { id: true } },
				mainStories: { select: { id: true } },
				sideStories: { select: { id: true } },
				relatedSeries: { select: { id: true } },
				relatedAlternatives: { select: { id: true } },
				references: true,
			},
		});
		if (!series) {
			throw new EntityNotFoundError();
		}

		const relations = this.synchroniseRelations(data, series);
		const references = data.references
			? this.synchroniseReferences(data.references, series.references)
			: undefined;

		return this.prisma.series.update({
			where: { id },
			data: {
				...rest,
				...relations,
				references,
			},
		});
	}

	private synchroniseRelations(
		input: {
			prequels?: string[];
			sequels?: string[];
			mainStories?: string[];
			sideStories?: string[];
			relatedSeries?: string[];
		},
		current: {
			prequels: { id: string }[];
			sequels: { id: string }[];
			mainStories: { id: string }[];
			sideStories: { id: string }[];
			relatedSeries: { id: string }[];
			relatedAlternatives: { id: string }[];
		},
	): Record<
		Relations,
		{ connect: { id: string }[]; disconnect: { id: string }[] }
	> {
		const relations: Record<
			Relations,
			{ connect: { id: string }[]; disconnect: { id: string }[] }
		> = {
			prequels: { connect: [], disconnect: [] },
			sequels: { connect: [], disconnect: [] },
			mainStories: { connect: [], disconnect: [] },
			sideStories: { connect: [], disconnect: [] },
			relatedSeries: { connect: [], disconnect: [] },
			relatedAlternatives: { connect: [], disconnect: [] },
		};
		const toString = (item: { id: string }) => item.id;
		const toItem = (item: string) => ({ id: item });
		for (const key of SIMPLE_RELATIONS) {
			if (input[key] === undefined) {
				continue;
			}
			const updated = new Set(input[key]);
			const existing = new Set(current[key].map(toString));
			const { lhsOnly, rhsOnly } = setCompare(updated, existing);
			relations[key].connect = Array.from(lhsOnly).map(toItem);
			relations[key].disconnect = Array.from(rhsOnly).map(toItem);
		}

		relations.relatedAlternatives.disconnect = Array.from(
			setCompare(
				new Set(input.relatedSeries),
				new Set(current.relatedAlternatives.map(toString)),
			).rhsOnly,
		).map((string) => ({ id: string }));

		const { lhsOnly, rhsOnly } = setCompare(
			new Set(input.relatedSeries),
			new Set(
				[...current.relatedSeries, ...current.relatedAlternatives].map(
					toString,
				),
			),
		);

		relations.relatedSeries.connect = Array.from(lhsOnly).map(toItem);
		relations.relatedSeries.disconnect = Array.from(rhsOnly).map(toItem);
		return relations;
	}

	private synchroniseReferences(
		input: { id?: string; source: string; link: string }[],
		current: Reference[],
	): {
		createMany: { data: { source: string; link: string }[] };
		updateMany: {
			where: { id: string };
			data: { source: string; link: string };
		}[];
		deleteMany: { id: string }[];
	} {
		const createMany = {
			data: input.filter((value) => value.id === undefined),
		};

		const updateMany = input
			.filter((value) => value.id)
			.map((item) => ({
				where: { id: item.id as string },
				data: { source: item.source, link: item.link },
			}));

		const deleteMany = current.filter((item) =>
			input.find((element) => element.id === item.id),
		);

		return { createMany, updateMany, deleteMany };
	}

	async delete(id: string): Promise<string | null> {
		try {
			const series = await this.prisma.series.delete({
				where: { id },
			});
			return series.id;
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError(`Series not found. (ID: ${id})`);
			}
			throw e;
		}
	}

	async computeSeasonNumber(id: string): Promise<number> {
		const series = await this.prisma.series.findUnique({
			where: { id },
		});
		assert(series);
		if (!series.releaseSeason || !series.releaseYear) {
			return 0;
		}
		const set: Set<{
			id: string;
			releaseYear: number | null;
			releaseSeason: Season | null;
		}> = new Set([
			{
				id,
				releaseYear: series.releaseYear,
				releaseSeason: series.releaseSeason,
			},
		]);
		let workingSet = new Set(Array.from(set));
		while (workingSet.size) {
			const nextSet: typeof workingSet = new Set();
			const promises = [];
			for (const item of workingSet) {
				promises.push(
					this.prisma.series
						.findMany({
							where: {
								OR: [
									{ sequels: { some: { id: item.id } } },
									{ prequels: { some: { id: item.id } } },
								],
							},
						})
						.then((result) =>
							result.forEach((item) =>
								nextSet.add({
									id: item.id,
									releaseYear: item.releaseYear,
									releaseSeason: item.releaseSeason,
								}),
							),
						),
				);
			}
			Array.from(workingSet).forEach((item) => set.add(item));
			await Promise.all(promises);
			const { rhsOnly } = setCompare(set, nextSet, deepEqual);
			workingSet = rhsOnly;
		}

		const results = Array.from(set)
			.map((item) => ({
				id: id,
				year: item.releaseYear,
				season: item.releaseSeason,
			}))
			.sort(releaseDateComparator);
		return results.findIndex((value) => value.id === id) + 1;
	}

	async computeStatus(id: string): Promise<string> {
		throw "Not Implemented";
	}
}
