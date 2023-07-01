import {dump} from "./index"



test("dumps problem", () => {

    const variables = {
        "a": [1,2],
        "b": [2,3]
    }

    const problem: Problem = {
        variables,
        constraints: [
            {
                var1: "a",
                var2: "b",
                predicate: (x:number,y:number) => x===y
            }
        ]
    }

    expect(dump(problem)).toBeUndefined();
});