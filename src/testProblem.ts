import { Problem } from "./csp"

export const variables = {
    "a": [1,2],
    "b": [2,3,1]
}

export const problem: Problem = {
    variables,
    constraints: [
        {
            head: "a",
            tail: "b",
            predicate: (x:number,y:number) => x===y
        }
    ]
}