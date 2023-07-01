import { Problem, solve } from "./csp";
import {dump} from "./index"
import { problem } from "./testProblem";



test("dumps problem", () => {

    

    expect(dump(problem)).toBeUndefined();
    expect(solve(problem)).toEqual({})
});