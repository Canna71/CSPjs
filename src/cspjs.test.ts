import {solve} from "./index"

test("returns Hellot", () => {
    expect(solve({ param: 1 })).toBe("Hello!");
});