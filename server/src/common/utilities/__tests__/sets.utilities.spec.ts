import { setCompare } from "../sets.utilities";

describe("Set Utilities", () => {
	describe(setCompare, () => {
		describe("Given intersecting sets", () => {
			const setA: Set<string> = new Set(["String 1", "String 2", "String 3"]);
			const setB: Set<string> = new Set(["String 3", "String 4", "String 5"]);

			const { lhsOnly, intersect, rhsOnly } = setCompare(setA, setB);

			test("Should return non-empty left difference", () => {
				expect(Array(...lhsOnly).sort()).toEqual(["String 1", "String 2"]);
			});
			test("Should return non-empty intersection", () => {
				expect(Array(...intersect).sort()).toEqual(["String 3"]);
			});
			test("Should return non-empty right difference", () => {
				expect(Array(...rhsOnly).sort()).toEqual(["String 4", "String 5"]);
			});
		});

		describe("Given proper subset", () => {
			const setA: Set<string> = new Set(["String 1", "String 2", "String 3"]);
			const setB: Set<string> = new Set(["String 1", "String 2"]);

			const { lhsOnly, intersect, rhsOnly } = setCompare(setA, setB);

			test("Should return non-empty left difference", () => {
				expect(Array(...lhsOnly).sort()).toEqual(["String 3"]);
			});
			test("Should return intersection equal to subset", () => {
				expect(Array(...intersect).sort()).toEqual(Array(...setB).sort());
			});
			test("Should return empty right difference", () => {
				expect(rhsOnly.size).toEqual(0);
			});
		});

		describe("Given non-overlapping sets", () => {
			const setA: Set<string> = new Set(["String 1", "String 2", "String 3"]);
			const setB: Set<string> = new Set(["String 4", "String 5", "String 6"]);

			const { lhsOnly, intersect, rhsOnly } = setCompare(setA, setB);

			test("Should return left difference equal to left set", () => {
				expect(Array(...lhsOnly).sort()).toEqual(Array(...setA).sort());
			});
			test("Should return empty intersection", () => {
				expect(intersect.size).toEqual(0);
			});
			test("Should return right difference equal to right set", () => {
				expect(Array(...rhsOnly).sort()).toEqual(Array(...setB).sort());
			});
		});

		describe("Given empty set", () => {
			const setA: Set<string> = new Set(["String 1", "String 2", "String 3"]);
			const emptySet: Set<string> = new Set();

			const { lhsOnly, intersect, rhsOnly } = setCompare(setA, emptySet);

			test("Should return left difference equal to left set", () => {
				expect(Array(...lhsOnly).sort()).toEqual(Array(...setA).sort());
			});
			test("Should return empty interesction", () => {
				expect(intersect.size).toEqual(0);
			});
			test("Should return empty right difference", () => {
				expect(rhsOnly.size).toEqual(0);
			});
		});

		describe("Given custom comparator", () => {
			const setA = new Set([{ x: 1, y: 1 }, { x: 2 }]);
			const setB = new Set([{ x: 1, y: 2 }, { x: 3 }]);

			const { lhsOnly, intersect, rhsOnly } = setCompare(setA, setB, (lhs, rhs) => {
				return lhs.x === rhs.x;
			});

			test("Should use custom comparator", () => {
				expect(Array(...lhsOnly)).toEqual([{ x: 2 }]);
				expect(Array(...intersect).map((o) => ({ x: o.x }))).toEqual([{ x: 1 }]);
				expect(Array(...rhsOnly)).toEqual([{ x: 3 }]);
			});
		});
	});
});
