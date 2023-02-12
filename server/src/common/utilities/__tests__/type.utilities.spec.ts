import { convertNullToUndefined } from "../type.utilities";
describe("Type Utilities", () => {
	describe(convertNullToUndefined, () => {
		const feature = convertNullToUndefined;
		test("Should convert null to undefined", () => {
			expect(feature({ x: null, y: 1 })).toEqual({ x: undefined, y: 1 });
		});

		test("Should convert null in array to undefined", () => {
			expect(feature({ x: [null, 1] })).toEqual({ x: [undefined, 1] });
		});

		test("Should convert null in nested object to undefined", () => {
			expect(feature({ x: { x: null, y: 1 } })).toEqual({ x: { x: undefined, y: 1 } });
		});
	});
});
