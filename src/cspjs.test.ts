import { Problem, solve } from "./csp";
import {dump} from "./index"
import { problem } from "./testProblem";



test("dumps problem", () => {

    

    expect(dump(problem)).toBeUndefined();

});

test("expets two solutions", () => {

    
    const solutions = [...solve(problem)]
    console.log(JSON.stringify(solutions))
    expect(solutions).toHaveLength(2)

});