import { Problem, solve } from "./csp";
// import {dump} from "./index"
import { problem1, problem2 } from "./testProblem";



test("expets two solutions", () => {

    
    const solutions = [...solve(problem1)]
    expect(solutions).toHaveLength(2)

});

test("expets no solutions", () => {

    
    const solutions = [...solve(problem2)]
    expect(solutions).toHaveLength(0)

});