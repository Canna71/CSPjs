import {Problem, solve} from "./csp"
import { problem } from "./testProblem";

export function dump(problem:Problem): any {
    
    for(let variable in problem.variables){
        const domain = problem.variables[variable];
        console.log(`${variable} : {${domain.join(', ')}}`);
    }
}

const solutions = [...solve(problem)]
console.log(JSON.stringify(solutions))