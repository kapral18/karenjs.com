import isObjectOfType from "./isObjectOfType";

describe("isObjectOfType", () => {
    it("should test every object member value with passed test function", () => {
        expect(
            isObjectOfType({ x: 1, y: 2, z: "3" }, (x) => typeof x === "number")
        ).toBe(false);

        expect(
            isObjectOfType({ x: 1, y: 2, z: 3 }, (x) => typeof x === "number")
        ).toBe(true);
    });

    it("should test every array member value with passed test function", () => {
        expect(isObjectOfType([1, 2, "3"], (x) => typeof x === "number")).toBe(
            false
        );

        expect(isObjectOfType([1, 2, 3], (x) => typeof x === "number")).toBe(
            true
        );
    });
});
