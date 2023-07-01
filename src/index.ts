import {Problem} from "./csp"

export function dump(problem:Problem): any {
    
    for(let variable in problem.variables){
        const domain = problem.variables[variable];
        console.log(`${variable} : {${domain.join(', ')}}`);
    }
}