import { Problem, solve } from "./csp";
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
                head: "a",
                tail: "b",
                predicate: (x:number,y:number) => x===y
            }
        ]
    }

    expect(dump(problem)).toBeUndefined();
    expect(solve(problem)).toEqual({})
});