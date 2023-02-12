import { Season } from "@prisma/client";

import { releaseDateComparator } from "../time.utilties";

describe("Time Utilities", () => {
	describe(releaseDateComparator, () => {
		const feature = releaseDateComparator;
		test("Empty dates should return 0", () => {
			expect(feature({ year: null, season: null }, { year: null, season: null })).toEqual(0);
		});

		test("Incomplete dates should return 0", () => {
			expect(feature({ year: 2000 }, { year: 3000, season: null })).toEqual(0);
		});

		test("Incomplete dates should come after known dates", () => {
			expect(
				feature({ year: 2000, season: Season.WINTER }, { year: 3000, season: null }),
			).toBeLessThan(0);
			expect(feature({ year: 2000 }, { year: 3000, season: Season.FALL })).toBeGreaterThan(0);
		});

		test("Same release date should return 0", () => {
			expect(
				feature({ year: 2000, season: Season.FALL }, { year: 2000, season: Season.FALL }),
			).toEqual(0);
		});

		test("Year difference should take precedence", () => {
			expect(
				feature({ year: 2000, season: Season.SPRING }, { year: 1000, season: Season.SPRING }),
			).toBeGreaterThan(0);
			expect(
				feature({ year: 2000, season: Season.SPRING }, { year: 3000, season: Season.SPRING }),
			).toBeLessThan(0);
		});

		test("Same year should compare seasons", () => {
			expect(
				feature({ year: 2000, season: Season.WINTER }, { year: 2000, season: Season.SPRING }),
			).toBeLessThan(0);
			expect(
				feature({ year: 2000, season: Season.FALL }, { year: 2000, season: Season.SPRING }),
			).toBeGreaterThan(0);
		});
	});
});
