import { Problem, enforceConstraint, solve } from "./csp";
// import {dump} from "./index"
import { problem1, problem2 } from "./testProblem";



test("expets two solutions", () => {

    
    const solutions = [...solve(problem1)]
    expect(solutions).toHaveLength(2)
    expect(solutions[0]["b"]).toBe(1);
    expect(solutions[1]["b"]).toBe(2);

});

test("expcts no solutions", () => {

    
    const solutions = [...solve(problem2)]
    expect(solutions).toHaveLength(0)

});

test("enforce constraints", () => {

    let variables = {...problem2.variables,"a":[1]}
    let enforced = enforceConstraint(variables, problem1.constraints);
   
    expect(enforced["b"]).toHaveLength(1)
    expect(enforced["b"][0]).toBe(1)


});
